/* eslint-disable no-constant-condition */
/* eslint-disable prefer-const */
/* eslint-disable no-var */

//globals to work correctly with .concat
var blockMedia = [];
var blockOthers = [];
var array_oid_to_num = {};
var oid_noprint = {};

function oid_to_num(inp) {
  // Check if the oid exists in the object oid_to_num
  if (inp in oid_to_num) {
    return array_oid_to_num[inp];
  }

  // Regular expression to match the format of the OID
  const regex = /^oid_(x[A-F0-9a-f]{4}|\d+)(_(.+))*$/;

  // Match the OID against the regular expression
  const match = inp.match(regex);
  if (match) {
    let num = match[1];

    // If the number starts with 'x', it is in hexadecimal
    if (num.startsWith('x')) {
      num = parseInt(num.slice(1), 16); // Convert the hex string to a decimal number
    } else {
      num = parseInt(num, 10); // Convert the decimal string to a decimal number
    }

    return num;
  }

  // Throw an error if the OID format is invalid
  throw new Error(`Invalid oid format '${inp}'`);
}

function keygen(ar_pre_key, pk) {
  const keygen_tbl = [
    [0, 1, 1, 2, 0, 1, 1, 2],
    [3, 3, 2, 1, 1, 2, 2, 1],
    [2, 2, 3, 1, 2, 2, 3, 1],
    [1, 0, 0, 0, 1, 0, 0, 0],
    [1, 2, 0, 1, 1, 2, 0, 1],
    [1, 2, 0, 2, 1, 2, 2, 2],
    [2, 1, 0, 0, 2, 1, 0, 0],
    [2, 3, 2, 2, 2, 3, 2, 2],
    [3, 0, 3, 1, 3, 0, 3, 1],
    [0, 0, 1, 1, 0, 3, 1, 1],
    [2, 2, 3, 0, 2, 2, 3, 1],
    [3, 1, 0, 0, 3, 1, 0, 0],
    [3, 3, 0, 2, 3, 3, 1, 2],
    [1, 2, 0, 0, 1, 2, 0, 0],
    [2, 1, 0, 3, 2, 1, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let key = new Array(512).fill(0);

  //Iterate over each byte of the input key
  for (let pk_ptr = 0; pk_ptr < ar_pre_key.length; pk_ptr++) {
    //Iterate over each block
    for (let block = 0; block < 8; block++) {
      //Modify the position according to the keygen_tbl
      key[block * 16 * 4 + pk_ptr * 4 + keygen_tbl[pk_ptr][block]] =
        (ar_pre_key[pk_ptr] + pk) & 0xff;
    }
  }

  return key;
}

function infillDword(ar, offset, dword) {
  // Write the bytes in little-endian order
  ar[offset] = dword & 0xff; // Least significant byte
  ar[offset + 1] = (dword >> 8) & 0xff; // Second byte
  ar[offset + 2] = (dword >> 16) & 0xff; // Third byte
  ar[offset + 3] = (dword >> 24) & 0xff; // Most significant byte
}

function infillWord(ar, offset, word) {
  // Write the bytes in little-endian order
  ar[offset] = word & 0xff; // Least significant byte
  ar[offset + 1] = (word >> 8) & 0xff; // Second byte
}

function setup_encryption(header, json_header, strong_encryption) {
  var header_key;
  var prekey_dw;
  var prekey;

  if ('encryption' in json_header) {
    header_key = json_header.encryption.header_key;
    prekey_dw = json_header.encryption.prekey_dw;
    prekey = json_header.encryption.prekey;
  } else {
    throw new Error('#TODO uninplemented');
  }

  if (prekey.length != 16) {
    throw new Error('Incorrect encryption key length');
  }

  if ((((header_key >> 24) + (prekey_dw & 0xff)) & 0xff) != 0xf5) {
    throw new Error('Incorrect encryption check');
  }

  infillDword(header, 0, header_key);
  infillDword(header, 4, 0x200 ^ header_key);
  infillDword(header, 0x140, prekey_dw);
  for (let i = 0; i < 16; i++) {
    header[0x144 + i] = prekey[i];
  }

  const real_key = keygen(prekey, (header_key >> 24) & 0xff);
  return {
    real_key,
    header_key,
  };
}

function processOids1(header, oids, OID_ARR, oid_to_num) {
  // Initialize min and max oid
  let min_oid = 0;
  let max_oid = 0;

  // Iterate through the keys of hr_oids
  for (let txt_oid in oids) {
    if (1) {
      // Regular expression to match the OID format
      let match = txt_oid.match(/^oid_(x[A-F0-9a-f]{4}|\d+)(_(.+))*$/);

      if (match) {
        let num = match[1];

        // Convert hex if the number is prefixed with 'x'
        if (num.startsWith('x')) {
          num = parseInt(num.substring(1), 16);
        } else {
          num = parseInt(num, 10);
        }

        // Check if the OID number already exists
        if (OID_ARR[num]) {
          throw new Error(
            `Duplicate oid definition for '${txt_oid}' (previous def ${OID_ARR[num]})`
          );
        }

        // Store the OID in the array and map it to a number
        OID_ARR[num] = txt_oid;
        array_oid_to_num[txt_oid] = num;

        // Update max_oid
        max_oid = Math.max(max_oid, num);
      } else {
        throw new Error(`Invalid oid format ${txt_oid}`);
      }
    }
  }

  // Log the range of OIDs
  console.log(
    `Oids range: 0x${min_oid.toString(16)}-0x${max_oid.toString(16)}`
  );

  infillWord(header, 0x18, min_oid);
  infillWord(header, 0x1a, max_oid);

  return {
    min_oid,
    max_oid,
  };
}

// parseMediaArrays function
function parseMediaArrays(object, maxBookMode, ALL_MEDIA) {
  // If object is not provided or it's not an object, exit early
  if (!object) {
    return maxBookMode;
  }

  if (typeof object !== 'object') {
    throw new Error('Expected object, invalid input!');
  }

  // Iterate over the keys of object, sorted alphabetically
  Object.keys(object)
    .sort()
    .forEach((modea) => {
      let mode;

      // Check if the key matches the expected 'mode_X' format
      const match = modea.match(/^mode_(\d+)$/);
      if (match) {
        mode = parseInt(match[1], 10); // Extract the number from the mode string
      } else {
        throw new Error(
          `Expected keyword mode_X, got '${modea}', invalid input file`
        );
      }

      // Update max_book_mode if the current mode is higher
      maxBookMode = Math.max(maxBookMode, mode);

      // For each item in the array corresponding to the current mode, set idx to 0 in ALL_MEDIA
      if (Array.isArray(object[modea])) {
        object[modea].forEach((iter) => {
          ALL_MEDIA[iter] = 0; // Set idx to 0
        });
      }
    });
  return maxBookMode; // Return the updated max_book_mode
}

// Function to write media arrays header
function writeMediaArraysHdr(
  header,
  offset,
  header_key,
  mediaArray,
  max_book_mode,
  ptr_others,
  ALL_MEDIA
) {
  const ptr = writeMediaArray(mediaArray, max_book_mode, ptr_others, ALL_MEDIA);

  if (ptr !== 0xffffffff) {
    infillDword(header, offset, ptr ^ header_key);
  }
}

// Function to write the media array itself
function writeMediaArray(ar, max_book_mode, ptr_others, ALL_MEDIA) {
  if (!ar) {
    return 0xffffffff; // Return invalid pointer if hr is falsy
  }

  const ptrReturn = ptr_others + blockOthers.length;

  for (let mode = 0; mode < max_book_mode; mode++) {
    const key = `mode_${mode}`;

    if (key in ar) {
      const sub_ar = ar[key];
      blockOthers.push(sub_ar.length & 0xff);
      blockOthers.push((sub_ar.length >> 8) & 0xff);
      sub_ar.forEach((iter) => {
        blockOthers.push(ALL_MEDIA[iter] & 0xff);
        blockOthers.push((ALL_MEDIA[iter] >> 8) & 0xff);
      });
    } else {
      blockOthers.push(0);
      blockOthers.push(0);
    }
  }
  return ptrReturn;
}

function write_oidtable_hdr(
  header,
  offset,
  header_key,
  ar,
  ptr_others,
  block_others,
  oids,
  oid_to_num
) {
  let ptr = write_oidtable(
    ar,
    true,
    ptr_others,
    block_others,
    oids,
    oid_to_num
  ); // Call write_oidtable with noprint = true

  if (ptr !== 0xffffffff) {
    infillDword(header, offset, ptr ^ header_key);
  }
}

function write_oidtable(
  ar,
  noprint,
  ptr_others,
  block_others,
  oids,
  oid_to_num
) {
  if (!ar) return 0xffffffff; // If the array is null or undefined, return 0xFFFFFFFF

  let ptr_return = ptr_others + block_others.length;

  // Create the block
  block_others.push(ar.length & 0xff);
  block_others.push((ar.length >> 8) & 0xff);

  for (let i = 0; i < ar.length; i++) {
    let oidNum = oid_to_num(ar[i]); // Convert OID to number
    block_others.push(oidNum & 0xff);
    block_others.push((oidNum >> 8) & 0xff);

    warn_on_oid(oids, ar[i], 'oidtable'); // Warn on missing OID

    if (noprint) {
      oid_noprint[oidNum] = true; // Mark OID as "no print"
    }
  }

  return ptr_return;
}

function warn_on_oid(oids, oid, str) {
  if (!oid in oids) {
    console.warn(
      `Warning: there is a reference to OID ${oid} (from ${str}) not present in OID table!`
    );
  }
}

function write_media_table(header, header_key, ptr_others, media_cnt) {
  let ptr_return = ptr_others + blockOthers.length;
  infillDword(header, 8, ptr_return ^ header_key);

  let media_table_beg = blockOthers.length;

  // Create a block of 0xFFFFFFFF values
  let ar = new Array((media_cnt + 1) * 4).fill(0xff);
  blockOthers = blockOthers.concat(ar);
  return media_table_beg;
}

function write_all_media(
  real_key,
  ALL_MEDIA,
  ptr_others,
  media_table_beg,
  files
) {
  let arr = [];
  for (const fn in ALL_MEDIA) {
    arr[ALL_MEDIA[fn]] = fn;
  }

  let ptrs = [];

  // Process each file
  for (const fn of arr) {
    let beforeMe = ptr_others + blockOthers.length + blockMedia.length;
    let remainsToBePadded = beforeMe % 0x200;

    let blk = [];
    if (remainsToBePadded) {
      blk = new Array(0x200 - remainsToBePadded).fill(0);
      beforeMe += 0x200 - remainsToBePadded;
    }

    const binaryString = files[fn];
    if (!binaryString) {
      debugger;
    }
    const buf = new Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      buf[i] = binaryString.charCodeAt(i);
    }

    decrypt_mem(buf, real_key); // Decrypt the file content
    blockMedia = blockMedia.concat(blk, buf);
    ptrs.push(beforeMe);
  }

  ptrs.push(ptr_others + blockOthers.length + blockMedia.length);

  ptrs.forEach((ptr, index) => {
    infillDword(blockOthers, index * 4 + media_table_beg, ptr);
  });
}

function decrypt_mem(data, keyArray) {
  const keyLength = keyArray.length;

  let kptr = 0; // Key pointer
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const keyByte = keyArray[kptr];

    if (keyByte) {
      if (d !== 0 && d !== 0xff && d !== keyByte && d !== (keyByte ^ 0xff)) {
        data[i] ^= keyByte; // XOR operation
      }
    }

    // Move to the next key byte
    kptr++;
    if (kptr >= keyLength) {
      kptr = 0; // Wrap around the key array
    }
  }
}

function packHexOidArray(ar, noprint) {
  // Create the block starting with the length of the array (little-endian format)
  let blk = new Array((ar.length + 1) * 2).fill(0);
  infillWord(blk, 0, ar.length);

  // Convert OIDs to numbers and append to the block
  let cnt = 1;
  ar.forEach((oid) => {
    let oidNum = oid_to_num(oid);
    infillWord(blk, cnt * 2, oidNum);
    oid_noprint[oidNum] = 1;

    cnt++;
  });

  return blk;
}

function write_quiz(ar, arq, bnl, headerKey, ptrOthers, oids) {
  let ptrReturn = ptrOthers + blockOthers.length;

  // Write pointer to quiz pointers
  infillDword(bnl, 0x11 * 4, ptrReturn ^ headerKey);

  // Remember where we write empty quiz pointers table
  let quizCnt = ar.length;
  if (quizCnt === 0) {
    console.warn('warning: zero length of quiz tables!');
  }

  console.log('writing quizes ' + quizCnt);
  let quizPtrs = new Array(quizCnt).fill(-1);

  let quizPtrsFill = new Array(quizCnt * 4).fill(0xff);
  let ptrQuiz = blockOthers.length;
  blockOthers = blockOthers.concat(quizPtrsFill);

  let cntQuiz = 0;
  for (let hrQuiz of ar) {
    quizPtrs[cntQuiz] = ptrOthers + blockOthers.length;

    let arQuestions = hrQuiz.questions;
    let quizType = hrQuiz.q_type;
    if (quizType !== 0 && quizType !== 4) {
      console.warn(
        `warning: quiz_type ${quizType} is not documented, could cause unknown behavior!`
      );
    }

    warn_on_oid(oids, hrQuiz.q_oid, 'q_oid'); // Warn on missing OID

    let q = arQuestions.length;
    let qa = hrQuiz.q_asked;

    if (q < qa) {
      console.warn(
        `warning: number of questions (${q}) < questions asked (${qa})!`
      );
    }

    if (quizType === 0) {
      let qr = arq.quiz_results.length;
      if (qa + 1 !== qr) {
        console.warn(
          `warning: number of questions asked (${qa}) does not match number of results (${qr}) in quiz_results!`
        );
      }
    }

    let qHdr = new Array(5 * 2).fill(0);
    infillWord(qHdr, 0, quizType);
    infillWord(qHdr, 2, arQuestions.length);
    infillWord(qHdr, 4, hrQuiz.q_asked);
    infillWord(qHdr, 6, hrQuiz.q_unk);
    infillWord(qHdr, 8, oid_to_num(hrQuiz.q_oid));

    blockOthers = blockOthers.concat(qHdr);

    let blockQuestions = [];
    let questionsBeg = [];
    for (let hrQuestion of arQuestions) {
      questionsBeg.push(blockQuestions.length);

      if (quizType === 4) {
        warn_on_oid(oids, hrQuestion.q4_oid, 'q4_oid'); // Warn on missing OID

        let question = new Array(4 * 2).fill(0);
        infillWord(question, 0, oid_to_num(hrQuestion.q4_oid));
        infillWord(question, 2, hrQuestion.q4_unk1);
        infillWord(question, 4, hrQuestion.q4_unk2);
        infillWord(question, 8, hrQuestion.q4_unk3);

        question = question.concat(
          packHexOidArray(hrQuestion.q4_good_reply_oids, 0)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_unknown_oids, 0)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_good_reply_snd1, 1)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_good_reply_snd2, 1)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_bad_reply_snd1, 1)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_bad_reply_snd2, 1)
        );
        question = question.concat(
          packHexOidArray(hrQuestion.q4_final_good, 1)
        );
        question = question.concat(packHexOidArray(hrQuestion.q4_final_bad, 1));

        blockQuestions = blockQuestions.concat(question);
      } else {
        warn_on_oid(oids, hrQuestion.q1_oid, 'q1_oid'); // Warn on missing OID

        oid_noprint[oid_to_num(hrQuestion.q1_oid)] = 1;

        let question = new Array(2 * 2).fill(0);
        infillWord(question, 0, hrQuestion.q1_unk);
        infillWord(question, 2, oid_to_num(hrQuestion.q1_oid));
        question = question.concat(
          packHexOidArray(hrQuestion.q1_good_reply_oids)
        );
        blockQuestions = blockQuestions.concat(question);
      }
    }

    let ptrQuestions = ptrOthers + blockOthers.length + questionsBeg.length * 4;
    questionsBeg = questionsBeg.map((qPtr) => qPtr + ptrQuestions);

    let cnt = 0;
    let tmp = new Array(questionsBeg.length * 4).fill(0);
    questionsBeg.forEach((p) => {
      infillDword(tmp, cnt * 4, p);
      cnt++;
    });

    let bef = blockOthers.length;
    blockOthers = blockOthers.concat(tmp);
    blockOthers = blockOthers.concat(blockQuestions);

    cntQuiz++;
  }

  // Rewrite quiz to point to correct places
  let cnt = 0;
  quizPtrs.forEach((p) => {
    infillDword(blockOthers, ptrQuiz + cnt * 4, p);
    cnt++;
  });
}

//function could be omitted altogether if json is already formatted as 3 separate jsons
function load_input(jsonData) {
  const namedData = {
    header: jsonData[0],
    quiz: jsonData[1],
    oids: jsonData[2],
  };

  // Check if each property contains an array
  const checks = {
    headerIsArray: Array.isArray(namedData.header),
    quizIsArray: Array.isArray(namedData.quiz),
    oidsIsArray: Array.isArray(namedData.oids),
  };

  // Return the named data object and the checks
  return {
    namedData,
    checks,
  };
}

function bnl_create(jsonOri, files) {
  // reset globals
  blockMedia = [];
  blockOthers = [];
  array_oid_to_num = {};
  oid_noprint = {};

  var res = load_input(jsonOri);
  const json = res.namedData;
  if (!res.checks) {
    throw new Error('JSON did not pass the checks!');
  }

  //fill up the header with emptiness
  var header = new Array(0x200).fill(0xff);

  //setup encryption
  var res = setup_encryption(header, json.header, 0);
  const real_key = res.real_key;
  const header_key = res.header_key;

  var OID_ARR = [];
  var ALL_MEDIA = {};

  res = processOids1(header, json.oids, OID_ARR, oid_to_num);
  var min_oid = res.min_oid;
  var max_oid = res.max_oid;

  // Before parsing any arrays, set to known bad value
  let maxBookMode = -1;

  // Preparse the whole OID table
  for (let i = min_oid; i <= max_oid; i++) {
    let k = OID_ARR[i]; // Get the OID key from the array
    if (k in json.oids) {
      maxBookMode = parseMediaArrays(json.oids[k], maxBookMode, ALL_MEDIA);
    }
  }

  // OID tables as an array of objects with dword offset and name
  const oidTables = [
    { offset: 0x03, name: 'start_button_1st_read' },
    { offset: 0x04, name: 'start_button_2nd_read' },
    { offset: 0x05, name: 'unk_tbl_ptr5' },
    { offset: 0x09, name: 'book_mode_read' },
    { offset: 0x18, name: 'unk_tbl_ptr_18' },
    { offset: 0x19, name: 'unk_tbl_ptr_19' },
    { offset: 0x1a, name: 'unk_tbl_ptr_1a' },
    { offset: 0x1b, name: 'unk_tbl_ptr_1b' },
    { offset: 0x1c, name: 'unk_tbl_ptr_1c' },
    { offset: 0x1d, name: 'unk_tbl_ptr_1d' },
    { offset: 0x1e, name: 'unk_tbl_ptr_1e' },
    { offset: 0x1f, name: 'unk_tbl_ptr_1f' },
    { offset: 0x20, name: 'unk_tbl_ptr_20' },
    { offset: 0x21, name: 'unk_tbl_ptr_21' },
    { offset: 0x22, name: 'unk_tbl_ptr_22' },
    { offset: 0x23, name: 'unk_tbl_ptr_23' },
    { offset: 0x24, name: 'unk_tbl_ptr_24' },
    { offset: 0x25, name: 'unk_tbl_ptr_25' },
    { offset: 0x26, name: 'unk_tbl_ptr_26' },
    { offset: 0x33, name: 'unk_tbl_ptr_33' },
    { offset: 0x34, name: 'unk_tbl_ptr_34' },
    { offset: 0x35, name: 'unk_tbl_ptr_35' },
    { offset: 0x36, name: 'unk_tbl_ptr_36' },
    { offset: 0x37, name: 'unk_tbl_ptr_37' },
    { offset: 0x38, name: 'unk_tbl_ptr_38' },
    { offset: 0x39, name: 'unk_tbl_ptr_39' },
    { offset: 0x40, name: 'unk_tbl_ptr_40' },
  ];

  // Iterate over each oid table entry to parse media arrays
  oidTables.forEach((entry) => {
    maxBookMode = parseMediaArrays(
      json.header[entry.name],
      maxBookMode,
      ALL_MEDIA
    );
  });

  // Check if maxBookMode is still uninitialized
  if (maxBookMode === -1) {
    throw new Error(
      'Max book mode left uninitialized after parsing. Input JSON file is incorrect.'
    );
  }
  maxBookMode++;
  infillDword(header, 0x2c, maxBookMode);
  console.log('Book modes:' + maxBookMode);

  let bookId = json.header.book_id;

  // Check if bookId is within the allowed range
  if (bookId >= 701 && bookId <= 9999) {
    console.log('Book id: ' + bookId);
    infillDword(header, 0x5c, bookId);
  } else {
    throw new Error(`Book id ${bookId} is out of range (701-9999)`);
  }

  let mediaCnt = 0;
  // Sort keys (filenames) and assign indices
  Object.keys(ALL_MEDIA)
    .sort()
    .forEach((fn) => {
      ALL_MEDIA[fn] = mediaCnt++; // Assign index and increment mediaCnt
    });

  infillWord(header, 0x1c, mediaCnt);
  infillWord(header, 0x1e, 0);

  console.log(`Media: references ${mediaCnt} files`);

  var blockOids = new Array((max_oid - min_oid + 1) * 4).fill(0xff);

  //Calculate ptr_others, which is the sum of lengths of block_header and block_oids
  let ptrOthers = header.length + blockOids.length;

  oidTables.forEach((entry) => {
    const offset = entry.offset * 4;
    const mediaData = json.header[entry.name];
    writeMediaArraysHdr(
      header,
      offset,
      header_key,
      mediaData,
      maxBookMode,
      ptrOthers,
      ALL_MEDIA
    );
  });

  for (let i = min_oid; i <= max_oid; i++) {
    let k = OID_ARR[i]; // Get the OID key

    // Check if the OID exists in hr_oids
    if (k in json.oids) {
      let ptr = writeMediaArray(
        json.oids[k],
        maxBookMode,
        ptrOthers,
        ALL_MEDIA
      ); // Call write_media_array function

      // If the pointer is valid (not 0xFFFFFFFF), update the OID array
      if (ptr !== 0xffffffff) {
        infillDword(blockOids, i * 4, ptr);
      }
    }
  }

  //write the quizes
  write_quiz(
    json.quiz['quizes'] ?? [],
    json.quiz,
    header,
    header_key,
    ptrOthers,
    json.oids
  );

  //write oidtables
  write_oidtable_hdr(
    header,
    0x12 * 4,
    header_key,
    json.quiz['quiz_pos1'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x13 * 4,
    header_key,
    json.quiz['quiz_pos2'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x14 * 4,
    header_key,
    json.quiz['quiz_neg1'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x15 * 4,
    header_key,
    json.quiz['quiz_neg2'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x16 * 4,
    header_key,
    json.header['unk_tbl_ptr_16'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x27 * 4,
    header_key,
    json.header['unk_tbl_ptr_27'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x28 * 4,
    header_key,
    json.header['unk_tbl_ptr_28'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x29 * 4,
    header_key,
    json.header['unk_tbl_ptr_29'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );
  write_oidtable_hdr(
    header,
    0x2a * 4,
    header_key,
    json.quiz['quiz_results'],
    ptrOthers,
    blockOthers,
    json.oids,
    oid_to_num
  );

  let media_table_beg_ptr = write_media_table(
    header,
    header_key,
    ptrOthers,
    mediaCnt
  );

  write_all_media(real_key, ALL_MEDIA, ptrOthers, media_table_beg_ptr, files);

  return header.concat(blockOids, blockOthers, blockMedia);
}

export { bnl_create };

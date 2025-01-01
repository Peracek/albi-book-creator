// HEADER

export interface BnlHeader {
  book_id: number;
  sys_icons?: string[] | null;
  encryption?: Encryption;
  book_mode_read: BookModeRead;
  start_button_1st_read: StartButton1stReadOrStartButton2ndRead;
  start_button_2nd_read: StartButton1stReadOrStartButton2ndRead;
  unk_tbl_ptr_16?: string[] | null;
  unk_tbl_ptr_27?: string[] | null;
  unk_tbl_ptr_28?: string[] | null;
  unk_tbl_ptr_29?: string[] | null;
}
export interface Encryption {
  header_key: number;
  prekey: number[];
  prekey_dw: number;
}
export interface BookModeRead {
  mode_0?: string[] | null;
  mode_2?: string[] | null;
}
export interface StartButton1stReadOrStartButton2ndRead {
  mode_0?: string[] | null;
  mode_1?: string[] | null;
  mode_2?: string[] | null;
}

// QUIZ

export interface Quiz {
  quiz_neg1?: string[] | null;
  quiz_neg2?: string[] | null;
  quiz_pos1?: string[] | null;
  quiz_pos2?: string[] | null;
  quiz_results?: string[] | null;
  quizes?: QuizesEntity[] | null;
}
export interface QuizesEntity {
  q_asked: number;
  q_oid: string;
  q_type: number;
  q_unk: number;
  questions?: QuestionsEntity[] | null;
}
export interface QuestionsEntity {
  q1_good_reply_oids?: string[] | null;
  q1_oid: string;
  q1_unk: number;
}

// OIDS

export type Oids = Record<string, Oid>;
type Oid = {
  mode_0?: string[] | null;
  mode_1?: string[] | null;
  mode_2?: string[] | null;
};

// BNL YAML FILE

export type BnlYamlFile = [BnlHeader, Quiz, Oids];

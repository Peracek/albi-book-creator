FROM perl:latest

# Install cpanminus for module installation
RUN cpan App::cpanminus

# Install required Perl modules
RUN cpanm MP3::Info Imager YAML

# Set the working directory inside the container
WORKDIR /app

# Copy your Perl script into the container
COPY ./apps/backend/albituzka/tools /app/tools

# Run the Perl script
# CMD ["perl", "your_script.pl"]
CMD ["/bin/bash"]

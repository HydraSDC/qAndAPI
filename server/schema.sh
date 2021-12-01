mongoimport -d sdc -c questions --type csv --file /seed/questions.csv --headerline
mongoimport -d sdc -c answers --type csv --file /seed/answers.csv --headerline
mongoimport -d sdc -c answersPhotos --type csv --file /seed/answers_photos.csv --headerline
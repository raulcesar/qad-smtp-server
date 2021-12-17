docker container exec -it <name> bash

docker container run \
-v $(pwd)/smtp-data:/usr/src/app/scratch \
-it testsmtpserver sh

-v $(pwd)/smtp-data:/usr/src/app/scratch \


docker container run \
-d \
-p 2525:2525 \
--name fake-smtp \
-v $(pwd)/smtp-data:/usr/src/app/scratch \
--init testsmtpserver

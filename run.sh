git pull origin main
name="sample-cell-website"
docker build -t ${name}:latest .
docker stop ${name}
docker rm ${name}
docker run -dti --name ${name} -p 10081:80 -d ${name}:latest


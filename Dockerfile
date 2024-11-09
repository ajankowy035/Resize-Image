FROM public.ecr.aws/sam/build-nodejs18.x:latest

COPY layers/sharp/package.json layers/sharp/package-lock.json* ./

RUN npm install --platform=linux --arch=x64 --production
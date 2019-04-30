# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:8.11.4
# Set the working directory to /client
WORKDIR /frontend
# copy package.json into the container at /frontend
COPY package*.json /frontend/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /frontend
COPY . /frontend/
# Make port 3000 available to the world outside this container
ENV REACT_APP_API_URL=http://localhost/api
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]

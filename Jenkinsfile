pipeline {
    agent any
    stages {
        stage('clone repository') {
            steps {
                git url: 'https://github.com/dawoodalam057/humanize-text.git', branch: 'main'
                
            }
        }
        stage('build docker image') {
            steps {
                sh "docker build -t humanize-text ."
            }
        }
        stage("login to docker hub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {    
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
            }
        }
        stage('push docker image') {
            steps {

                sh "docker push dawoodalam057/humanize-text:latest"
            }
        }
        stage('deploy docker image') {
            steps {
                sh "docker-compose down"
                sh "docker-compose up -d"
            }
        }
        stage('Done ') {
            steps {
                echo 'Done'
                }
            }
        }
    }
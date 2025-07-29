pipeline {
  agent any

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/melihcgn/park-density-estimator.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t my-next-app .'
      }
    }

    stage('Stop Previous Container') {
      steps {
        sh 'docker rm -f my-next-app-container || true'
      }
    }

    stage('Run New Container') {
      steps {
        sh 'docker run -d -p 3000:3000 --name my-next-app-container my-next-app'
      }
    }
  }
}

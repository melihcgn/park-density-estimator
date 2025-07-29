pipeline {
  agent any

  stages {
    stage('Clone Repo') {
      steps {
        // GitHub'dan projeyi klonla (Jenkins job ayarlarında repo tanımlıysa gerek yok)
        git 'https://github.com/melihcgn/park-density-estimator.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          dockerImage = docker.build("my-next-app")
        }
      }
    }

    stage('Stop Previous Container') {
      steps {
        script {
          sh 'docker rm -f my-next-app-container || true'
        }
      }
    }

    stage('Run New Container') {
      steps {
        script {
          sh 'docker run -d -p 3000:3000 --name my-next-app-container my-next-app'
        }
      }
    }
  }
}

pipeline{
    agent any
    environment {
      // 镜像名称
      IMAGE_NAME = "inspur-admin-digital-village-ui"
      // 工作目录
      WS = "${WORKSPACE}"
      // 后台项目镜像名称
      API_IMAGE_NAME = "inspur-admin-digital-village"
      // 自定义的构建参数
      PROFILE = "prod"
      // docker网络
      DOCKER_NETWORK = "inspur"
    }

    triggers {
//         cron('TZ=Asia/Shanghai\nH 19 * * *') // 每天下午19-20点随机一个时间执行
        cron('TZ=Asia/Shanghai\n30 3 * * 3,5') // 每周三和周五凌晨3点执行
    }

    //定义流水线的加工流程
    stages {
        //流水线的所有阶段
        stage('1.环境检查'){
            steps {
               sh 'pwd && ls -alh'
               sh 'printenv'
               sh 'docker version'
               sh 'git --version'
            }
        }

        stage('2.编译'){
            agent {
                docker {
                    image 'node:20.15-slim'
                 }
            }
            steps {
               sh 'pwd && ls -alh'
               sh 'node -v'
               sh 'cd ${WS} && npm config set registry https://registry.npmmirror.com && npm install -g pnpm@8.6.0 && pnpm install --no-frozen-lockfile && npm run build:prod'
            }
        }

        stage('3.打包'){
            steps {
               sh 'pwd && ls -alh'
               sh 'docker build --build-arg PROFILE=${PROFILE} -t ${IMAGE_NAME} .'
            }
        }

        stage('4.部署'){
            // 删除容器和虚悬镜像
            steps {
               sh 'pwd && ls -alh'
               sh 'docker rm -f ${IMAGE_NAME} || true && docker rmi $(docker images -q -f dangling=true) || true'
               sh 'docker network list | grep "${DOCKER_NETWORK}" &&  echo "docker network ${DOCKER_NETWORK} is exist" || docker network create ${DOCKER_NETWORK}'
               sh 'docker run -d --name ${IMAGE_NAME} --network ${DOCKER_NETWORK} ${IMAGE_NAME}'
            }
        }
    }
}

library identifier: 'pipeline-library', changelog: false

slave("jenkins-slave-${UUID.randomUUID().toString()}") {
    // <-- project 별로 달라지는 변수들
    def namespace = "misc"
    def deployment = "redocs"
    def imageName = "redocs"
    // -->
    def commitHash

    stage("Checkout") {
        commitHash = it.checkout()
    }

    stage("Build") {
        container("docker") {
            dockerBuild(imageName, env.IMAGE_TAG, "--build-arg NODE_ENV=${env.NODE_ENV} --build-arg PORT=3000 --build-arg COMMIT_HASH=${commitHash} .")
        }
    }

    stage("Deploy") {
        container("curl") {
            deploy(namespace, deployment)
        }
    }
}

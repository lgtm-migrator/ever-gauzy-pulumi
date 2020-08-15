// tslint:disable-next-line: no-var-requires
require('dotenv').config();
import {
	getRunningEnvironment,
	Environment,
	setupDemoEnvironment,
	setupDevEnvironment,
	setupProdEnvironment,
	setupFargateEnvironment,
	setupECSEnvironment,
} from './src/environments';
import { createDockerImages } from './src/docker-images';
import { RepositoryImage } from '@pulumi/awsx/ecr';

export = async () => {
	const environment = await getRunningEnvironment();

	console.log(`Running in ${environment} Environment`);

	const dockerImages = await createDockerImages(environment);

	let resource;

	switch (environment) {
		case Environment.Fargate:
			// resource = await setupFargateEnvironment(dockerImages);
			break;

		case Environment.ECS:
			// resource = await setupECSEnvironment(dockerImages);
			break;

		case Environment.Dev:
			resource = await setupDevEnvironment({
				apiImage: <RepositoryImage>dockerImages.apiImage,
				webappImage: <RepositoryImage>dockerImages.webappImage,
			});
			break;

		case Environment.Demo:
			/*
			resource = await setupDemoEnvironment({
				apiImage: <RepositoryImage>dockerImages.apiImage,
				webappImage: <RepositoryImage>dockerImages.webappImage
			});
			*/
			break;

		case Environment.Prod:
			/*
			resource = await setupProdEnvironment({
				apiImage: <RepositoryImage>dockerImages.apiImage,
				webappImage: <RepositoryImage>dockerImages.webappImage
			});
			*/
			break;
	}

	return {
		out: {
			clusterUrn: resource?.cluster.urn,
			dbClusterUrn: resource?.dbCluster.urn,
		},
	};
};

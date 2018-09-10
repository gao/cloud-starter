(All code & content are [MIT](https://opensource.org/licenses/MIT) licensed.)

**cloud-starter** is a simple but scalable code base (e.g., *blueprint*) to build "big" cloud application based on bus driven multi-service and modern web user interface. 

**NOTE:** This is still in early development and the code needs many fine-tuning. However, the key architecture components have been implemented and now ready to be iterated on. Feel free to drop us a line if you have any question.

## Approach

- **Kubernetes**: Kubernetes is a transformative technology for building cloud application and this architecture fully leverage Kubernetes (and docker) for REPL development as well as deployment. Does require Docker for Desktop with Kubernetes enabled. 

- **node.js** / **TypeScript**: The JavaScript platform has come a very long way since . Between Google dedication prowess with V8 javascript runtime, node.js fully async runtime model, npm, combined with a modern and powerful structural typing system (TypeScript), the Node/TS

- **Event-based architecture**: Thanks to Kubernetes and docker, multi-service architectures (e.g., microservice architecture) have never been as simple, and this allows to start a new project with highly scalable architecture from the get-go, and that it with a message bus (.e.g., redis power in this case). While message base architecture is not designed to replace SOA architecture entirely, it does make the system much more reliable and extensible by offloading the "main-to-many" service internal dependencies. 

## Key Structure

This blueprint is based on a "monorepo" approach where all of the services are based on the same repository and can be built as a whole or individually. 

The key code structure is as follow: 

- **k8s/**: This is where the Kubernetes resource files reside. They are organized by *realms* (more on that later) that are destined to be deployed on a local or remote environment. (more on **realms** later). 

- **scripts/** files are just the build files for the various "devops" operations, such as building, repl watch, and other custom scripts. 

- **services/** base folder contain each service of the system as well as common resources. For example `services/web-server` is the node js web API and application service, and `services/agent` is the agent micro-service which manage some devops operations during deployment. 

- **web/** is the base folder for the web ui source code. During build process the distribution files (e.g., `app-bundle.js`) will get written in the `services/web-server/web-folder/` directory.

## Key Tech Stack

- Runtimes: Alpine Linux as much as possible, Node.js 10.x services, Redis for the message bus, and Postgres for DB.
- Code: Typescript (latest) for all backend, microservice, as well as UI code. 
- Web
	- CSS: Postcss
	- HTML Templating: Handlebars
	- DOM MVC: MVDOM (Dom Centric MVC ... simple scale better ... used right the DOM is a solid foundation for building large application UIs)

We have standardized our IDE to be VSCode for everything, and while it might not have everything other Ideas, we found that it's tight integration with TypeScript (our language of choice) and its fast innovation has given us a nice productivity boost. 

## Local Dev Requirements

As of now, the development environment has been tested on Mac, but it should work on Windows as well. 

- Install Docker for Mac with Kubernetes
- Run a local docker registry with (for the kubernetes local dev)

```sh
docker run -d -p 5000:5000 --restart=unless-stopped --name registry registry:2.6.2
```

## Build and run
- `npm install`
- `npm run dbuild` (this build all of the needed docker images, and push then to the local registry)
- `npm run kcreate` (this will create all of the kuberenetes resources)
- `npm run recreateDb` (this will call the `agent` microservice to create the db. In prod, the `agent` service is used to make drop sql snapshots, db update and other devops related scripts). 

Now, you should be able to go to http://localhost:8080/ and login as **admin** / **welcome**

More [developer workflow](doc/dev-workflow.md)

## Clean

- `npm run kdelete` (this will delete all of the kubernetes resources)


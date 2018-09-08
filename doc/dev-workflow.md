

## Build

```sh

# build all of the services / docker images
npm run dbuild

# build one service
npm run dbuild web-server

# build more than one
npm run dbuild web-server,agent
```

## Install, recreateDb

```sh

# install all kubernetes pods and start them
npm run kcreate

# install the DB by going throw the agent service
npm run recreateDb

# Now can go to http://localhost:8080/
```

## REPL Dev

`npm run watch` allows to run watch on each services and restart the appropriate services as required. 

The `watch` script is in `scripts/cmd-watch.ts` and can be customize as services / system grow. `vdev` module does not attempt to do too much in this area, as being focused on the exact need is often more effective to build a omni-build system. 

Note that `npm run watch` also start a kube port forward for the node debug sessions for the services (today `web-server` is the one supported)


## Testing

Each services should have a `test/` folder with some `.ts` test files. To run thoes from mac, you can do for example: 

```sh
npm run kexec web-server -- npm test -- -g test-hello
```

Later, `dtest` will be supported for being able to put a break point on a test file (it will need its custom port)
```sh
npm run kexec web-server -- npm dtest -- -g test-hello
```


## Debugging

At this point, the debugging is enable on the `web-server` when doing a `run-watch` (which start a port forward on )


Then, look at the `.vscode/launch.json` `Attach to web-server` and starting it via vscode should allow to debug the web server. 


Note: In the future, debugging will be added to other services, and to the test, with different port for each. 
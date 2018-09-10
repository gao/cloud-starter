

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
npm run test web-server

# or to run only some test (with the it('dao-...', ...) for example
npm run test web-server dao
```


#### REPL Testing

`testw` allows to continuously run test (or some test) each time a service src or test files are changed. To run some test each time a test files or source files get changed (will do once when multi-save), do the following. 

```sh
# to watch dist files and run test, 
npm run testw web-server

# to run only some test (the -g ...) 
npm run testw web-server test-hello
# This will run only test that have 'test-hello' in their mochac it(...) names
```

In short, the `scripts/cmd-trun.ts` just do a `npm run kexec web-server -- npm test [-- -g _filter_]` on dist file changes.


#### Testing with DEBUG


`testd` act similarely, but start the service node test with the `--inspec-break` which wait for a debug session to be attached. 

```sh
npm run testd web-server

#or filtered, as 
npm run testd web-server dao
```


## Debugging


When running a `npm run watch` the web-server will be started with the debug flag `--inspect` which allows to start a debug session. 


Look at the `.vscode/launch.json` `Attach to web-server` and starting it via vscode should allow to debug the web server. 


Note: For now, the debugging is for the web-server, and will be added to other services later. 

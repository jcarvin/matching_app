# Global Matching

### Summary
This project aims to recreate and expand upon the existing Item (Brand) and Location (Store) matching apps using ReactJS. 

Wherever possible, components will be kept as modular as the concepts will allow and reused wherever they are appropriate. 

### Database

The project relies on a postgREST API currently sitting on an instance of postgreSQL but can be configured to sit on
 SQLserver. The API is on [BigGuy](http://192.168.168.174:3000/) at http://192.168.168.174:3000/ and is [querried using
 strings](https://postgrest.com/en/v0.4/api.html) appended to the end of the request urls. 
 (e.g. `http://192.168.168.174:3000/tablename?table_column=eq.1234`)
 
 There are a few RPCs unique to the project. These can be found in the application by searching for `RPC` 
 
### Framework
 The [react_boilerplate](https://gitlab.infobate.com/jcarvin/react_boilerplate) project was used kind of as a casing
 for this project. Any prerequisites needed to run that project are also needed to run this one. Additionally it's
 brought up in the same way...
 
### Project installation
 After [project dependencies](https://gitlab.infobate.com/jcarvin/react_boilerplate) have been installed, open a 
 terminal of your choice and do the following.
  * clone this repository
      `git clone git@gitlab.infobate.com:jcarvin/react_boilerplate.git <your-project-name>`
  * cd into the new directory `cd <your-project-name>`
  * bring up the environment. `vagrant up`
    * On first run this will take a while it download and installs everything.
  * Once the machine is done being created and provisioned.  Type `vagrant ssh`
    * This will put us within the vagrant machine we just brought up.
  * You should be dropped directly into the `/vagrant/containers` directory, however if you arent type 
  `cd /vagrant/containers` to enter the 
 docker-compose project folder.
  * Typing `sudo docker-compose up` will start the project.  The first run takes a while.
   * `docker-compose start` or `docker-compose up -d` will avoid having to waste a terminal window on 
 logs, unless you want that.
 * Now point your browser to [http://localhost:8080/](http://localhost:8080/) and you should see the title page of the
 of the matching apps



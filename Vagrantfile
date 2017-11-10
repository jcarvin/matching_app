# -*- mode: ruby -*-
# vi: set ft=ruby :


$npm_fix = <<SCRIPT
mkdir -p /home/vagrant/node_modules
mkdir -p /vagrant/containers/app/node_modules
ls -s /home/vagrant/node_modules /vagrant/containers/app/node_modules


SCRIPT

$vagrant_setup = <<SCRIPT

echo "cd /vagrant/containers" >> /home/vagrant/.bashrc

cd /vagrant/containers
IP=$(hostname -I | awk '{printf $1}')
rm .env
touch .env

echo "IP=${IP}"                             >> .env
echo "DATA_DIR=/home/vagrant/data"          >> .env
echo "PG_USER=postgres"                     >> .env
echo "PG_PASSWORD=${PG_PASSWORD}"           >> .env
echo "PGREST_USER=authenticator"            >> .env
echo "PGREST_PASSWORD=${PGREST_PASSWORD}"   >> .env
echo "PG_PORT=5432"                         >> .env
echo "DEPLOY=${DEPLOY}"                     >> .env
echo "TABLESAMPLE_SIZE=${TABLESAMPLE_SIZE}" >> .env
SCRIPT

Vagrant.configure(2) do |config|
  config.env.enable

  config.vm.box = "centos/7"
  config.vm.hostname = "docker-host"
  config.vm.provider :virtualbox do |vb, override|
    # Fix docker not being able to resolve private registry in VirtualBox
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3100, host: 3100
  config.vm.network "forwarded_port", guest: 3001, host: 3001
  config.vm.network "forwarded_port", guest: 4440, host: 4440
  config.vm.network "forwarded_port", guest: 5432, host: 5432
  config.vm.network "forwarded_port", guest: 6432, host: 6432
  config.vm.network "forwarded_port", guest: 8888, host: 8888
  config.vm.network "forwarded_port", guest: 50070, host: 50070
  config.vm.network "forwarded_port", guest: 8020, host: 8020
  config.vm.network "forwarded_port", guest: 10000, host: 10000
  config.vm.network "forwarded_port", guest: 10002, host: 10002
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 8088, host: 8088
  config.vm.network "forwarded_port", guest: 1433, host: 1433
  config.vm.network "forwarded_port", guest: 4000, host: 4000


  config.vm.synced_folder ".", "/vagrant", type: "rsync",
    rsync__exclude: [".git/", "containers/.env", "containers/data/", "containers/app/node_modules"]
  config.vm.network "public_network"

  config.vm.provision "shell", path: "./provisioning_scripts/disable_selinux.sh"
  config.vm.provision "shell", path: "./provisioning_scripts/docker-install.sh"
  config.vm.provision "shell", inline: $vagrant_setup, env: {
    "TABLESAMPLE_SIZE" => ENV['TABLESAMPLE_SIZE'],
    "DEPLOY"           => ENV['DEPLOY'],
    "PG_PASSWORD"      => ENV['PG_PASSWORD'],
    "PGREST_PASSWORD"  => ENV['PGREST_PASSWORD']
  }
  config.vm.provision "shell", inline: $npm_fix
  config.vm.provision "shell", path: "./provisioning_scripts/app_setup.sh"
  config.vm.provision "shell", path: "./provisioning_scripts/excel_services_setup.sh"

  config.vm.provider "virtualbox" do |vb|
  #   # Customize the amount of memory on the VM:
    vb.memory = ENV['RAM'] || "8174"
    vb.cpus = ENV['CPUS'] || 4
   end
end

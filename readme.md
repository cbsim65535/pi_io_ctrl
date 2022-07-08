sudo apt-get install pigpio


### using 80 port

sudo apt-get install authbind
sudo touch /etc/authbind/byport/80
sudo chown pi /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
sudo touch /etc/authbind/byport/443
sudo chown pi /etc/authbind/byport/443
sudo chmod 755 /etc/authbind/byport/443

authbind --deep pm2 start
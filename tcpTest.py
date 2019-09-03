import socket

hostname, sld, tld, port = 'www', 'integralist', 'co.uk', 80
target = '{}.{}.{}'.format(hostname, sld, tld)

# create an ipv4 (AF_INET) socket object using the tcp protocol (SOCK_STREAM)
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# connect the client
# client.connect((target, port))
client.connect(('119.59.125.170', 1234))

# send some data (in this case a HTTP GET request)
#//addr/pm1/pm2/pm10/airtemp/airhumid/uv/rain/soil/wind
#   99/50/100/150/25/80/0.3/1/70/30/91
client.send('99/50/100/150/25/80/0.3/1/70/30/91'.encode())

# receive the response data (4096 is recommended buffer size)
while True:
    response = client.recv(4096)
    if not response: 
        break
    print ("received data:", response)
    break
    # client.send(data)
client.close()


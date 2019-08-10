import socket
import sys

HOST, PORT = "localhost", 2888
data = "$TIME_SYNC$"

# Create a socket (SOCK_DGRAM means datagrams, aka UDP)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

try:
    # Send some data
    sock.sendto(data + "\n", (HOST, PORT))
    received = sock.recv(64) # 1024 bytes = 1KB
except KeyboardInterrupt:
    print("Forcefully shutting down client...")
    sys.exit(1)

print("Sent: {}".format(data))
print("Received: {}".format(received))
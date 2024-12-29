import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        socketInstance = socket("http://localhost:3000", {
            auth: {
                token: localStorage.getItem('token')
            },
            query: {
                projectId
            }
        });

        // Handle socket connection errors (optional)
        socketInstance.on('connect_error', (err) => {
            console.error("Socket connection error:", err);
        });
    }

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    console.log("received");
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    }
};

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};

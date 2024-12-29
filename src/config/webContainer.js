import { WebContainer } from '@webcontainer/api';

// Store the WebContainer instance
let webContainerInstance = null;

// Function to initialize and return the WebContainer instance
export const getWebContainer = async () => {
    // If the WebContainer instance is not initialized, boot it up
    if (!webContainerInstance) {
        try {
            // Boot up the WebContainer instance
            webContainerInstance = await WebContainer.boot();
        } catch (error) {
            console.error("Error booting WebContainer:", error);
            throw new Error("Failed to initialize WebContainer");
        }
    }
    // Return the existing WebContainer instance
    return webContainerInstance;
}

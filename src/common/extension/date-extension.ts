export function convertToDD_MM_YYYY(dateString: string): string {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = date.getFullYear();

    // Return the date in DD-MM-YYYY format
    return `${day}-${month}-${year}`;
}

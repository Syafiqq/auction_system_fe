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

export function nullableStringToDate(dateString: string | null | undefined): Date | null {
    if (dateString === null || dateString === undefined) {
        return null;
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

export function nullableStringToDateLocal(dateString: string | null | undefined): Date | null {
    if (dateString === null || dateString === undefined) {
        return null;
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

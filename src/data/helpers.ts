// FILE: src/data/helpers.ts

/**
 * Formats a number to KES currency format, e.g., "KES 3,500"
 */
export function formatKES(amount: number): string {
  if (amount === undefined || amount === null) return "KES 0";
  return `KES ${Math.round(amount).toLocaleString('en-KE')}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD or full ISO) to "DD MMM YYYY" format, e.g., "15 Jun 2025"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    // Basic parse
    const datePart = dateString.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    if (monthIndex < 0 || monthIndex > 11 || isNaN(day)) {
      return dateString;
    }
    
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (e) {
    return dateString;
  }
}

/**
 * Parses e.g. "2026-06" to printable "June 2026"
 */
export function formatMonthYear(monthStr: string): string {
  const parts = monthStr.split('-');
  if (parts.length !== 2) return monthStr;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const idx = parseInt(parts[1], 10) - 1;
  if (idx >= 0 && idx <= 11) {
    return `${monthNames[idx]} ${parts[0]}`;
  }
  return monthStr;
}

/**
 * Capitalizes first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

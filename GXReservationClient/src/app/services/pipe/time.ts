
export function hoursToTimeSpan(hours: number): string {
  const totalSeconds = Math.floor(hours * 3600);
  const hh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const remainingSeconds = totalSeconds % 3600;
  const mm = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const ss = (remainingSeconds % 60).toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
  
  // Calculate end time from start time and duration
  export function calculateEndTime(startTime: string, durationHours: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;
  }

  export function toDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


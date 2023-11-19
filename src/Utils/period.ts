export const getPeriod = (period: number): string => {
    switch (period) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      case 4:
        return 'OT';
      case 5:
        return 'SO';
      default:
        return 'not found';
    }
  }
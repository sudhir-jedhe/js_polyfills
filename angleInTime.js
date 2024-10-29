/**
 * @param {string} time
 * @returns {number} 
 */
function angle(time) {
    // your code here
    const [hour, min] = time.split(':').map((seg) => parseInt(seg, 10))
    
    const h = (hour >= 12 ? hour - 12 : hour)
    const m = min
    const angleMin = (m / 60) * 360
    const angleHour = (h / 12) * 360 + angleMin / 12
    
    const angle = Math.abs(angleHour - angleMin)
    const finalAngle = angle > 180 ? 360 - angle : angle
    return Math.round(finalAngle)
  }


  function angle(time) {
    const [hours, minutes] = time.split(':');
    const hourAngle = (360 / 12) * (hours % 12);
    const minutesAngle = (360 / 60) * (minutes);
    
    const extra = (minutes/60) * (360/12)
    
    let finalAngle = (Math.abs(hourAngle - minutesAngle + extra));
    finalAngle = finalAngle > 180 ? 360 - finalAngle : finalAngle;
    
    return Math.round(finalAngle);
  }


  angle('12:00')
// 0
angle('23:30')
// 165
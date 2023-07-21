const calculateAQI = (pm25: number) => {
  let aqi;
  if (pm25 <= 12) {
    aqi = (50 / 12) * pm25;
  } else if (pm25 <= 35.4) {
    aqi = ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51;
  } else if (pm25 <= 55.4) {
    aqi = ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101;
  } else if (pm25 <= 150.4) {
    aqi = ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151;
  } else if (pm25 <= 250.4) {
    aqi = ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201;
  } else if (pm25 <= 350.4) {
    aqi = ((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301;
  } else {
    aqi = ((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401;
  }

  aqi = Math.round(aqi);

  let category;
  if (aqi <= 50) {
    category = 'Good';
  } else if (aqi <= 100) {
    category = 'Moderate';
  } else if (aqi <= 150) {
    category = 'Unhealthy for Sensitive Groups';
  } else if (aqi <= 200) {
    category = 'Unhealthy';
  } else if (aqi <= 300) {
    category = 'Very Unhealthy';
  } else {
    category = 'Hazardous';
  }

  return { aqi, category };
};

const convertPm25ToColor = (pm25: number) => {
  const { category } = calculateAQI(pm25);

  switch (category) {
    case 'Good':
      return 'rgba(40, 161, 60, 0.8)';
    case 'Moderate':
      return 'rgba(212, 203, 68, 0.8)';
    case 'Unhealthy for Sensitive Groups':
      return 'rgba(237, 88, 61, 0.8)';
    case 'Unhealthy':
      return 'rgba(240, 79, 158, 0.8)';
    case 'Very Unhealthy':
      return 'rgba(154, 89, 158, 0.8)';
    case 'Hazardous':
    default:
      return 'rgba(196, 31, 55, 0.8)';
  }
};

export { calculateAQI, convertPm25ToColor };

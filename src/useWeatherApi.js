import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = (locationName) => {
  // 在api中的網址參數帶入locationName去撈取特定地區的天氣資料
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-11696254-5993-42F8-9DA6-4D706DC057DE&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // 目前僅call 台北api
      // console.log("data", data);
      // 取出會用到的資料
      const locationData = data.records.location[0];
      // console.log('%',locationData)
      // 將風速,氣溫,濕度取出
      // STEP 2：將風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料取出，強..
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      // console.log(weatherElements)
      // 更新資料
      //若回傳為物件可不需要return，但需加小括號
      return {
        observationTime: locationData.time.obsTime,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
      // setWeatherElement(
      //   {
      //     ...weatherElement,
      //     temperature: 99,
      //   }
      // )
    });
  // 更新狀態
};

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-11696254-5993-42F8-9DA6-4D706DC057DE&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      // console.log("%", locationData);
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            // console.log("@");
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      // console.log("$", weatherElements);
      return {
        // description:
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    }, {});
};
// 接收hook參數
const useWeatherApi = (currentLocation) => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    description: "",
    temperature: 0,
    windSpeed: 0,
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: 0,
    isLoading: true
  });
  const { cityName, locationName } = currentLocation
  // console.log('^',cityName,locationName)
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        // locationName是給 [觀測]資料拉取api用的地區名稱
        fetchCurrentWeather(locationName),
        // NityName是給 [預測]資料拉取api用的地區名稱
        fetchWeatherForecast(cityName)
      ]);
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };
    // 執行fetchingData
    // console.log("fetch");
    setWeatherElement((prevState) => {
      return {
        ...prevState,
        isLoading: true
      };
    });
    fetchingData();
  }, [locationName,cityName]);
  // 一旦cityName改變 fetchData也會改變，useEffect也會重新執行，拉取最新資料
  useEffect(() => {
    // asnyc func
    // console.log("effect", fetchData);
    fetchData();
  }, [fetchData]);
  // 把要給其他React組件料或方法傳遞回去
  return [weatherElement, fetchData];
};

export default useWeatherApi;

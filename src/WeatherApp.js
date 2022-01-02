import { useState, useEffect, useMemo } from "react";
import {findLocation} from './utils'
import useWeatherApi from "./useWeatherApi";
import { ThemeProvider } from "@emotion/react";

import styled from "@emotion/styled";
// 匯入css func
// import { css } from "@emotion/react";

import WeatherCard from "./WeatherCard";
import WeatherSetting from "./WeatherSetting";
import sunriseAndSunsetData from "./sunrise-sunset.json";

// 將一批css樣式定義成js func
// const buttonDefault = () =>css`
//   display: block;
//   width: 120px;
//   height: 30px;
//   font-size: 14px;
//   background-color: transparent;
//   color: #212121;

// `
// const RejectButton = styled.button`
//   ${buttonDefault};
//   border-color: red;
//   color: red;
// `
// const AcceptButton = styled.button`
//   ${buttonDefault};
//   border-color: green;
//   color: green;
// `
// theme

// 定義主題色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

// 定義帶有 styled compoment
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// FUNC
// 取得當日日夜狀態
const getMoment = (locationName) => {
  // console.log("memo operate");
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );
  // 若找不到該地區回傳null
  if (!location) return null;
  const now = new Date();
  // 將當前時間已"2019-10-11"的格式顯示，待研究
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  // 取出當天資料
  const locationDate =
    location.time && location.time.find((data) => data.dataTime === nowDate);

  // 比較時間戳戳，若當天時間介於日出跟日落則顯示白天，反之
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimestamp = now.getTime();

  return sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  // 取出localStorage值
  const storageCity = localStorage.getItem('cityName')
  // 顯示哪一個組件的狀態
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  // 若localstorage存在則使用，沒有就預設台北市
  const [currentCity, setCurrentCity] = useState(storageCity ||'臺北市')
  // 根據 currentCity 找到對應的對應不同api時顯示的名稱，命名為currentLocation的物件
  const currentLocation =  findLocation(currentCity) || {}
  // 將currentLocation 當作參數傳入useWeatherApi(Hook)
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  // 日夜狀態
  const [currentTheme, setCurrentTheme] = useState("light");
 
  // 因為useEffect有使用道useCallback，故callback要在前面，hook間有順序關係
  // 如果某個函式不需要被覆用，那麼可以直接定義在 useEffect 中，但若該方法會需要被共用，則把該方法提到 useEffect 外面後，記得用 useCallback 進行處理後再放到 useEffect 的 dependencies 中

  // 將日夜狀態運算好的值儲存下來
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [currentLocation.sunriseCityName]);

  // 依據moment 決定深色/淺色模式
  useEffect(() => {
    setCurrentTheme(moment === "night" ? "dark" : "light");
  }, [moment]);
  // 依據城市名稱狀態，取localStorage值
  useEffect(()=>{
    localStorage.setItem('cityName', currentCity)
  },[currentCity])
  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* {console.log("render")} */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            weatherElement={weatherElement}
            cityName={currentLocation.cityName}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting setCurrentPage={setCurrentPage} cityName={currentLocation.cityName} setCurrentCity={setCurrentCity} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;

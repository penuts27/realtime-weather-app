import styled from "@emotion/styled";
import dayjs from "dayjs"
import WeatherIcon from "./WeatherIcon";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RedoIcon } from "./images/refresh.svg";
import { ReactComponent as CogIcon } from "./images/cog.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

const Location = styled.p`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
  font-weight: 600;

  color: ${(props) => props.theme === "dark" && "#212121"};
`;
const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;
const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 100;
`;
const Celsius = styled.span`
  font-size: 42px;
  font-weight: 400;
`;

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;
const WeatherCard = (props) => {
  const {
    observationTime,
    description,
    temperature,
    windSpeed,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading
  } = props.weatherElement;
  const { setCurrentPage, fetchData, moment, cityName } = props;
  return (
    <WeatherCardWrapper>
      <Location>{cityName}</Location>
      <Description>
        {description} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)}
          <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || "day"}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {Math.round(rainPossibility)} %
      </Rain>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間{" "}
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric"
        }).format(dayjs(observationTime))}
        {isLoading ? <LoadingIcon /> : <RedoIcon />}
      </Refresh>
      <Cog onClick={() => setCurrentPage("WeatherSetting")} />

      {/* <RejectButton theme='red'> 你好</RejectButton>
  <AcceptButton> 你好</AcceptButton> */}
    </WeatherCardWrapper>
  );
};
export default WeatherCard;

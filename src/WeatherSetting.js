import styled from "@emotion/styled";
// 匯入availavleLocation
import { availableLocations } from './utils'
import { useState } from "react";

// 從availableLocation中取出cityName 來做為使用者可以選擇的清單
const locations = availableLocations.map(location => location.cityName)


const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  display: inline-block;
  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: ${({ theme }) => theme.boxShadow};
  box-sizing: border-box;
  padding: 20px;
`;
const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;
const StyledLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.titleColor};
  font-size: 16px;
  margin-bottom: 1px;
`;
const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background-color: transparent;
  outline: none;
  border: 1px solid ${({ theme }) => theme.textColor};
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > button {
    diplay: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }
    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;
const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;
const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const WeatherSetting = ({ setCurrentPage,cityName,setCurrentCity }) => {
  const [locationName, setLoactionName] = useState(cityName);
  const handleInput = (e) => {
    setLoactionName(e.target.value);
  };
  const handleSave = () => {
    // 檢查輸入質是否涵蓋在APi城市中
    if (locations.includes(locationName)) {
      console.log(`儲存的地區資訊為：${locationName}`);
      // 儲存進weatherApp的 currentCity state裡
      setCurrentCity(locationName)
      setCurrentPage("WeatherCard");
    } else {
      window.alert(`儲存失敗，您輸入的「${locationName}」非有效區域`);
    }
  };
  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlfor="locarion">地區</StyledLabel>
      <StyledInputList
        id="location"
        name="location"
        list="location-list"
        onChange={handleInput}
        value={locationName}
      />
      <datalist id="location-list">
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>
      <ButtonGroup>
        <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};
export default WeatherSetting;

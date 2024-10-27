<template>
  <div :class="['frame', className]">
    <div class="group">
      <div class="text-wrapper">Teams.co</div>
      <div class="overlap-group-wrapper">
        <div class="overlap-group">
          <div class="ellipse" />
          <div class="div" />
        </div>
      </div>
    </div>
    <div class="group-2">
      <img class="img" alt="Ellipse" src="../assets/ellipse-212.svg" />
      <div class="text-wrapper-2">Aman</div>
      <div class="text-wrapper-3">Product Designer</div>
    </div>
    <div class="group-3">
      <div class="group-4">
        <div class="text-wrapper-4">Dashboard</div>
        <img
          class="img-2"
          alt="Dashboard black"
          src="../assets/dashboard-black-24dp-1-1.svg"
        />
      </div>
      <div class="group-5">
        <div class="text-wrapper-5">Teams</div>
        <img
          class="img-3"
          alt="People alt black"
          src="../assets/people-alt-black-24dp-1.svg"
        />
      </div>
      <div class="group-6">
        <div class="text-wrapper-6">Payments</div>
        <img
          class="img-2"
          alt="Payments black"
          src="../assets/payments-black-24dp-1.svg"
        />
      </div>
      <div class="group-7">
        <div class="text-wrapper-4">Attendance</div>
        <img
          class="event-available"
          alt="Event available"
          src="../assets/event-available-black-24dp-1.svg"
        />
      </div>
      <div class="group-8">
        <div class="text-wrapper-7">Settings</div>
        <img
          class="img-3"
          alt="Settings black"
          src="../assets/settings-black-24dp-1-1.svg"
        />
      </div>
      <div class="rectangle" />
    </div>
    <div class="group-9">
      <img
        class="bx-bx-dots"
        alt="Bx bx dots"
        src="../assets/bx-bx-dots-horizontal-rounded.svg"
      />
      <div class="group-10">
        <img
          class="groups-black"
          alt="Groups black"
          src="../assets/groups-black-24dp-1-1.svg"
        />
        <div class="create-teams">Create&nbsp;&nbsp;Teams</div>
        <p class="increase-your-speed">
          Increase your speed with
          <br />
          more members
        </p>
      </div>
    </div>
    <div class="rectangle-2" />
  </div>
</template>

<script>
export default {
  name: "Frame",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.frame {
  background-color: #2e2e48;
  border-radius: 30.82px;
  box-shadow: 10.35px 11.5px 72.43px #0000003d;
  height: 937px;
  overflow: hidden;
  position: relative;
  width: 234px;
}

.frame .group {
  height: 28px;
  left: 53px;
  position: absolute;
  top: 58px;
  width: 131px;
}

.frame .text-wrapper {
  color: #ffffff;
  font-family: "Poppins-ExtraBold", Helvetica;
  font-size: 18.5px;
  font-weight: 800;
  left: 35px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 0;
  width: 94px;
}

.frame .overlap-group-wrapper {
  height: 22px;
  left: 0;
  position: absolute;
  top: 3px;
  width: 22px;
}

.frame .overlap-group {
  height: 22px;
  position: relative;
}

.frame .ellipse {
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgb(137.11, 126.86, 255) 0%,
    rgb(82.37, 67.36, 255) 100%
  );
  border-radius: 11.17px / 10.59px;
  height: 21px;
  left: 0;
  position: absolute;
  top: 0;
  width: 22px;
}

.frame .div {
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgb(239.06, 6.38, 6.38) 22.19%,
    rgb(176.37, 1.03, 1.03) 100%
  );
  border-radius: 4.41px;
  height: 9px;
  left: 14px;
  position: absolute;
  top: 14px;
  width: 9px;
}

.frame .group-2 {
  height: 119px;
  left: 73px;
  position: absolute;
  top: 146px;
  width: 99px;
}

.frame .img {
  height: 59px;
  left: 18px;
  position: absolute;
  top: 0;
  width: 59px;
}

.frame .text-wrapper-2 {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 17px;
  font-weight: 600;
  left: 21px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 75px;
  width: 53px;
}

.frame .text-wrapper-3 {
  color: #ffffff66;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 10.8px;
  font-weight: 600;
  left: 0;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 103px;
  width: 95px;
}

.frame .group-3 {
  height: 289px;
  left: 0;
  position: absolute;
  top: 309px;
  width: 167px;
}

.frame .group-4 {
  height: 21px;
  left: 48px;
  position: absolute;
  top: 12px;
  width: 116px;
}

.frame .text-wrapper-4 {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 13.9px;
  font-weight: 600;
  left: 35px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 0;
}

.frame .img-2 {
  height: 18px;
  left: 0;
  position: absolute;
  top: 1px;
  width: 18px;
}

.frame .group-5 {
  height: 21px;
  left: 48px;
  position: absolute;
  top: 76px;
  width: 86px;
}

.frame .text-wrapper-5 {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 13.9px;
  font-weight: 600;
  left: 35px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 0;
  width: 49px;
}

.frame .img-3 {
  height: 18px;
  left: 0;
  position: absolute;
  top: 0;
  width: 18px;
}

.frame .group-6 {
  height: 21px;
  left: 48px;
  position: absolute;
  top: 140px;
  width: 109px;
}

.frame .text-wrapper-6 {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 13.9px;
  font-weight: 600;
  left: 35px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 0;
  width: 72px;
}

.frame .group-7 {
  height: 21px;
  left: 48px;
  position: absolute;
  top: 204px;
  width: 121px;
}

.frame .event-available {
  height: 18px;
  left: 0;
  position: absolute;
  top: 2px;
  width: 18px;
}

.frame .group-8 {
  height: 21px;
  left: 48px;
  position: absolute;
  top: 268px;
  width: 108px;
}

.frame .text-wrapper-7 {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 13.9px;
  font-weight: 600;
  left: 35px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 0;
  width: 70px;
}

.frame .rectangle {
  background: linear-gradient(
    180deg,
    rgb(126, 115, 255) 0%,
    rgb(91, 77, 255) 100%
  );
  height: 45px;
  left: 0;
  position: absolute;
  top: 0;
  width: 7px;
}

.frame .group-9 {
  background: linear-gradient(
    180deg,
    rgb(72.48, 62.57, 189.13) 0%,
    rgba(46, 46, 72, 0) 100%
  );
  border-radius: 30.82px;
  box-shadow: 0px 3.08px 25.43px #00000040;
  height: 179px;
  left: 27px;
  position: absolute;
  top: 701px;
  width: 180px;
}

.frame .bx-bx-dots {
  height: 26px;
  left: 135px;
  position: absolute;
  top: 25px;
  width: 26px;
}

.frame .group-10 {
  height: 95px;
  left: 21px;
  position: absolute;
  top: 54px;
  width: 142px;
}

.frame .groups-black {
  height: 42px;
  left: 0;
  position: absolute;
  top: 0;
  width: 42px;
}

.frame .create-teams {
  color: #ffffff;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 13.9px;
  font-weight: 600;
  left: 0;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 42px;
  width: 103px;
}

.frame .increase-your-speed {
  color: #ffffff66;
  font-family: "Poppins-SemiBold", Helvetica;
  font-size: 10.8px;
  font-weight: 600;
  left: 0;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 62px;
  width: 138px;
}

.frame .rectangle-2 {
  background-color: #2e2e48;
  border-radius: 10.79px;
  box-shadow: 0px 3.08px 28.51px #0000001c;
  height: 52px;
  left: 301px;
  position: absolute;
  top: 498px;
  width: 119px;
}
</style>

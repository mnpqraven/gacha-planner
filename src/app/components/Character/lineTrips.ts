import { Path } from "@/bindings/AvatarConfig";
import { cva } from "class-variance-authority";

export function getLineTrips(path: Path) {
  switch (path) {
    case "Erudition":
      return [
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point10", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point13", "Point15"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point05", "Point18"],
      ];
    case "Nihility":
      return [
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point18"],
      ];
    case "Destruction":
      return [
        ["Point01", "Point02"],
        ["Point03", "Point04"],
        ["Point03", "Point05"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point05", "Point09"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point06", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
      ];
    case "Hunt":
      return [
        ["Point03", "Point01"],
        ["Point01", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point15"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point05", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point05", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
      ];
    case "Preservation":
      return [
        ["Point03", "Point01"],
        ["Point01", "Point12"],
        ["Point03", "Point02"],
        ["Point02", "Point15"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point09", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
      ];
    case "Harmony":
      return [
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point16", "Point17"],
        ["Point16", "Point18"],
        ["Point04", "Point01"],
        ["Point01", "Point06"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point04", "Point02"],
        ["Point02", "Point07"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point04", "Point03"],
        ["Point03", "Point05"],
        ["Point05", "Point09"],
        ["Point09", "Point12"],
        ["Point09", "Point15"],
      ];
    case "Abundance":
      return [
        ["Point01", "Point02"],
        ["Point03", "Point04"],
        ["Point04", "Point08"],
        ["Point08", "Point16"],
        ["Point08", "Point17"],
        ["Point03", "Point05"],
        ["Point06", "Point10"],
        ["Point10", "Point11"],
        ["Point11", "Point12"],
        ["Point07", "Point13"],
        ["Point13", "Point14"],
        ["Point14", "Point15"],
        ["Point06", "Point07"],
        ["Point18", "Point09"],
      ];
  }
}

export function traceVariants(path: Path) {
  switch (path) {
    case "Erudition":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[46%] left-[calc(50%-17.5%)]",
            Point02: "top-[46%] left-[calc(50%+17.5%)]",
            Point03: "top-[46%] left-[calc(50%)]",
            Point04: "top-[28%] left-[calc(50%)]",
            Point05: "top-[77%] left-[calc(50%)]",
            Point06: "top-[46%] left-[calc(50%-32%)]",
            Point07: "top-[46%] left-[calc(50%+32%)]",
            Point08: "top-[8%]  left-[calc(50%)]",
            Point09: "top-[75%] left-[calc(50%-17.5%)]",
            Point10: "top-[46%] left-[calc(50%-47%)]",
            Point11: "top-[61%] left-[calc(50%-41.67%)]",
            Point12: "top-[32%] left-[calc(50%-41.67%)]",
            Point13: "top-[46%] left-[calc(50%+47%)]",
            Point14: "top-[61%] left-[calc(50%+41.67%)]",
            Point15: "top-[32%] left-[calc(50%+41.67%)]",
            Point16: "top-[12%] left-[calc(50%-20%)]",
            Point17: "top-[12%] left-[calc(50%+20%)]",
            Point18: "top-[75%] left-[calc(50%+17.5%)]",
          },
        },
      });
    case "Nihility":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[42%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[42%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[38%] left-[calc(50%)]", //  ult
            Point04: "top-[20%] left-[calc(50%)]", //  talent
            Point05: "top-[57%] left-[calc(50%)]", //  tech
            Point06: "top-[30%] left-[calc(50%-32%)]", //  left big
            Point07: "top-[30%] left-[calc(50%+32%)]", //  right big
            Point08: "top-[2%]  left-[calc(50%)]", //  up big
            Point09: "top-[70%] left-[calc(50%)]", //  down small 1
            Point10: "top-[43%] left-[calc(50%-43.75%)]", //  left small 1
            Point11: "top-[55%] left-[calc(50%-32%)]", //  left small 2
            Point12: "top-[67%] left-[calc(50%-17.5%)]", //  left small 3
            Point13: "top-[43%] left-[calc(50%+43.75%)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%+32%)]", //  right small 2
            Point15: "top-[67%] left-[calc(50%+17.5%)]", //  right small 2
            Point16: "top-[6%]  left-[calc(50%-20%)]", //  top left small
            Point17: "top-[6%]  left-[calc(50%+20%)]", //  top right small
            Point18: "top-[85%] left-[calc(50%)]", //  down small 2
          },
        },
      });
    case "Destruction":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[47%] left-[calc(50%)]", //  ult
            Point04: "top-[32%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point08: "top-[15%] left-[calc(50%)]", //  up big
            Point09: "top-[80%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[2%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[7%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[7%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Hunt":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[45%] left-[calc(50%)]", //  ult
            Point04: "top-[28%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point08: "top-[13%] left-[calc(50%)]", //  up big
            Point09: "top-[80%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[0%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Preservation":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[47%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[47%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[46%] left-[calc(50%)]", //  ult
            Point04: "top-[30%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%-23.5%)]", //  left small 3
            Point07: "top-[72%] left-[calc(50%+23.5%)]", //  right small 2
            Point08: "top-[14%] left-[calc(50%)]", //  up big
            Point09: "top-[75%] left-[calc(50%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%-37.5%)]", //  left small 2
            Point11: "top-[48%] left-[calc(50%-47.5%)]", //  left small 1
            Point12: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point13: "top-[60%] left-[calc(50%+37.5%)]", //  right small 2
            Point14: "top-[48%] left-[calc(50%+47.5%)]", //  right small 1
            Point15: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point16: "top-[0%]  left-[calc(50%)]", //  down small 2
            Point17: "top-[5%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[5%]  left-[calc(50%+20%)]", //  top right small
          },
        },
      });
    case "Harmony":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[34%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[34%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[52%] left-[calc(50%)]", //  ult
            Point04: "top-[28%] left-[calc(50%)]", //  talent
            Point05: "top-[69%] left-[calc(50%)]", //  tech
            Point06: "top-[52%] left-[calc(50%-31.67%)]", //  left big
            Point07: "top-[52%] left-[calc(50%+36.67%)]", //  right big
            Point08: "top-[14%] left-[calc(50%)]", //  up big
            Point09: "top-[83%] left-[calc(50%)]", //  down middle small
            Point10: "top-[40%] left-[calc(50%-43.75%)]", //  left small 1
            Point11: "top-[27%] left-[calc(50%-31.67%)]", //  left small 2
            Point12: "top-[80%] left-[calc(50%-17.5%)]", //  down left small
            Point13: "top-[65%] left-[calc(50%+25.5%)]", //  right small 1
            Point14: "top-[55%] left-[calc(50%+15%)]", //  right small 2
            Point15: "top-[80%] left-[calc(50%+17.5%)]", //  down right small
            Point16: "top-[2%]  left-[calc(50%)]", //  top middle
            Point17: "top-[6%]  left-[calc(50%-20%)]", //  top right small
            Point18: "top-[6%]  left-[calc(50%+20%)]", //  top left small
          },
        },
      });
    case "Abundance":
      return cva("absolute", {
        variants: {
          anchor: {
            Point01: "top-[37%] left-[calc(50%-17.5%)]", //  basic
            Point02: "top-[37%] left-[calc(50%+17.5%)]", //  skill
            Point03: "top-[43%] left-[calc(50%)]", //  ult
            Point04: "top-[25%] left-[calc(50%)]", //  talent
            Point05: "top-[62%] left-[calc(50%)]", //  tech
            Point06: "top-[72%] left-[calc(50%+17.5%)]", //  right small 2
            Point07: "top-[72%] left-[calc(50%-17.5%)]", //  left small 3
            Point08: "top-[4%]  left-[calc(50%)]", //  up big
            Point09: "top-[82%] left-[calc(50%+10%)]", //  down small 1
            Point10: "top-[60%] left-[calc(50%+31.67%)]", //  right small 2
            Point11: "top-[48%] left-[calc(50%+43.75%)]", //  right small 1
            Point12: "top-[35%] left-[calc(50%+31.67%)]", //  right big
            Point13: "top-[60%] left-[calc(50%-31.67%)]", //  left small 2
            Point14: "top-[48%] left-[calc(50%-43.75%)]", //  left small 1
            Point15: "top-[35%] left-[calc(50%-31.67%)]", //  left big
            Point16: "top-[7%]  left-[calc(50%+20%)]", //  down small 2
            Point17: "top-[7%]  left-[calc(50%-20%)]", //  top left small
            Point18: "top-[82%] left-[calc(50%-10%)]", //  top right small
          },
        },
      });
  }
}
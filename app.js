const kobeWards = [
  ["神戸市東灘区", 0.94, 82, 82, 88, ["神戸市", "阪神間", "住宅地"]],
  ["神戸市灘区", 0.98, 78, 80, 86, ["神戸市", "阪急", "JR"]],
  ["神戸市兵庫区", 0.9, 60, 78, 84, ["神戸市", "都心近接", "港町"]],
  ["神戸市長田区", 0.84, 62, 70, 80, ["神戸市", "家賃抑制", "下町"]],
  ["神戸市須磨区", 0.86, 72, 68, 76, ["神戸市", "海", "住宅地"]],
  ["神戸市垂水区", 0.83, 76, 72, 76, ["神戸市", "明石海峡", "住宅地"]],
  ["神戸市北区", 0.78, 82, 58, 58, ["神戸市", "自然", "広さ"]],
  ["神戸市中央区", 1.15, 58, 98, 98, ["神戸市", "三宮", "商業集積"]],
  ["神戸市西区", 0.82, 80, 62, 62, ["神戸市", "住宅地", "大学"]]
];

/** Approximate ward centers — used when TopoJSON is unavailable (fallback disks). */
const kobeCentroids = {
  神戸市東灘区: [34.717, 135.272],
  神戸市灘区: [34.705, 135.218],
  神戸市兵庫区: [34.665, 135.174],
  神戸市長田区: [34.658, 135.151],
  神戸市須磨区: [34.641, 135.136],
  神戸市垂水区: [34.628, 135.082],
  神戸市北区: [34.853, 135.239],
  神戸市中央区: [34.695, 135.195],
  神戸市西区: [34.669, 134.979]
};

const baseAreas = (window.HYOGO_AREAS || []).filter((area) => area.name !== "神戸市");
const kobeBase = (window.HYOGO_AREAS || []).find((area) => area.name === "神戸市") || {
  rent: { studio: 5.8, oneLdk: 8.2, twoLdk: 10.4 }
};

// listedCompanies is counted by head-office municipality from J-LiC search results for Hyogo.
const areaStats = {
  神戸市東灘区: { population: 214000, householdIncome: 570, listedCompanies: 4 },
  神戸市灘区: { population: 136000, householdIncome: 540, listedCompanies: 2 },
  神戸市兵庫区: { population: 106000, householdIncome: 430, listedCompanies: 3 },
  神戸市長田区: { population: 94000, householdIncome: 390, listedCompanies: 2 },
  神戸市須磨区: { population: 156000, householdIncome: 450, listedCompanies: 2 },
  神戸市垂水区: { population: 214000, householdIncome: 455, listedCompanies: 0 },
  神戸市北区: { population: 208000, householdIncome: 455, listedCompanies: 0 },
  神戸市中央区: { population: 148000, householdIncome: 520, listedCompanies: 41 },
  神戸市西区: { population: 236000, householdIncome: 470, listedCompanies: 0 },
  姫路市: { population: 525000, householdIncome: 430, listedCompanies: 11 },
  尼崎市: { population: 455000, householdIncome: 410, listedCompanies: 16 },
  明石市: { population: 306000, householdIncome: 455, listedCompanies: 4 },
  西宮市: { population: 485000, householdIncome: 560, listedCompanies: 5 },
  洲本市: { population: 41000, householdIncome: 360, listedCompanies: 0 },
  芦屋市: { population: 94000, householdIncome: 720, listedCompanies: 1 },
  伊丹市: { population: 198000, householdIncome: 470, listedCompanies: 3 },
  相生市: { population: 28000, householdIncome: 380, listedCompanies: 0 },
  豊岡市: { population: 76000, householdIncome: 360, listedCompanies: 0 },
  加古川市: { population: 258000, householdIncome: 420, listedCompanies: 4 },
  赤穂市: { population: 45000, householdIncome: 375, listedCompanies: 0 },
  西脇市: { population: 38000, householdIncome: 360, listedCompanies: 0 },
  宝塚市: { population: 224000, householdIncome: 520, listedCompanies: 3 },
  三木市: { population: 74000, householdIncome: 385, listedCompanies: 0 },
  高砂市: { population: 86000, householdIncome: 410, listedCompanies: 1 },
  川西市: { population: 151000, householdIncome: 500, listedCompanies: 0 },
  小野市: { population: 47000, householdIncome: 385, listedCompanies: 0 },
  三田市: { population: 106000, householdIncome: 500, listedCompanies: 0 },
  加西市: { population: 42000, householdIncome: 370, listedCompanies: 0 },
  丹波篠山市: { population: 39000, householdIncome: 375, listedCompanies: 0 },
  養父市: { population: 22000, householdIncome: 340, listedCompanies: 0 },
  丹波市: { population: 61000, householdIncome: 360, listedCompanies: 0 },
  南あわじ市: { population: 44000, householdIncome: 350, listedCompanies: 1 },
  朝来市: { population: 28000, householdIncome: 350, listedCompanies: 0 },
  淡路市: { population: 42000, householdIncome: 350, listedCompanies: 0 },
  宍粟市: { population: 35000, householdIncome: 345, listedCompanies: 0 },
  加東市: { population: 40000, householdIncome: 390, listedCompanies: 1 },
  たつの市: { population: 73000, householdIncome: 385, listedCompanies: 3 },
  猪名川町: { population: 29000, householdIncome: 480, listedCompanies: 0 },
  多可町: { population: 19000, householdIncome: 345, listedCompanies: 0 },
  稲美町: { population: 30000, householdIncome: 395, listedCompanies: 0 },
  播磨町: { population: 34000, householdIncome: 410, listedCompanies: 1 },
  市川町: { population: 11000, householdIncome: 340, listedCompanies: 0 },
  福崎町: { population: 19000, householdIncome: 370, listedCompanies: 0 },
  神河町: { population: 10000, householdIncome: 335, listedCompanies: 0 },
  太子町: { population: 34000, householdIncome: 395, listedCompanies: 0 },
  上郡町: { population: 14000, householdIncome: 345, listedCompanies: 0 },
  佐用町: { population: 15000, householdIncome: 335, listedCompanies: 0 },
  香美町: { population: 16000, householdIncome: 335, listedCompanies: 0 },
  新温泉町: { population: 13000, householdIncome: 335, listedCompanies: 0 }
};

const chainStatKeys = [
  "homeCenters",
  "mcdonalds",
  "yoshinoya",
  "sukiya",
  "matsuya",
  "saizeriya",
  "cheapChainTotal",
  "hospitals",
  "clinics",
  "medicalTotal"
];

for (const stats of Object.values(areaStats)) {
  for (const key of chainStatKeys) {
    stats[key] = null;
  }
}

const areaGeometries = {};
const hyogoOverpassBBox = [34.18, 133.98, 35.82, 135.98];
const chainQueryEndpoint = "https://overpass-api.de/api/interpreter";
let chainStatsLoading = false;
let chainStatsLoaded = false;
let medicalStatsLoading = false;
let medicalStatsLoaded = false;

const condoPriceByArea = window.HYOGO_CONDO_PRICES || {};

function withAreaStats(area) {
  return {
    ...area,
    stats: areaStats[area.name] || { population: null, householdIncome: null, listedCompanies: null }
  };
}

const areaData = [
  ...kobeWards.map(([name, rentRate, safety, commerce, access, tags]) => {
    const [lat, lng] = kobeCentroids[name];
    return {
      name,
      region: "神戸",
      lat,
      lng,
      rent: {
        studio: roundRent(kobeBase.rent.studio * rentRate),
        oneLdk: roundRent(kobeBase.rent.oneLdk * rentRate),
        twoLdk: roundRent(kobeBase.rent.twoLdk * rentRate)
      },
      safety,
      commerce,
      access,
      lifestyle: Math.round((safety + commerce + access) / 3),
      commute: access,
      tags,
      summary: `${name}は神戸市内の区別比較対象です。家賃、交通、商業、治安を区単位で見て、神戸市内でも予算に合う場所を探せます。`
    };
  }),
  ...baseAreas
].map(withAreaStats);

const regionDefaults = {
  神戸: {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線", "神戸市営地下鉄", "ポートライナー", "六甲ライナー", "神戸電鉄"],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  阪神南: {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線"],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  阪神北: {
    routes: ["JR福知山線", "阪急宝塚本線", "阪急今津線", "能勢電鉄", "神戸電鉄"],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  東播磨: {
    routes: ["JR神戸線", "山陽電鉄本線", "JR加古川線"],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  中播磨: {
    routes: ["JR神戸線", "JR播但線", "JR姫新線", "山陽電鉄本線", "山陽新幹線"],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  西播磨: {
    routes: ["JR山陽本線", "JR姫新線", "JR赤穂線", "山陽電鉄本線"],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  北播磨: {
    routes: ["JR加古川線", "神戸電鉄粟生線", "北条鉄道"],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  但馬: {
    routes: ["JR山陰本線", "JR播但線"],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  丹波: {
    routes: ["JR福知山線", "JR加古川線"],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  淡路: {
    routes: ["鉄道なし", "高速バス"],
    stores: { maruhachi: "なし", marui: "なし", lamu: "要確認", gyomu: "要確認" }
  }
};

const areaProfiles = {
  "神戸市中央区": {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線", "神戸市営地下鉄海岸線", "ポートライナー", "神戸市営地下鉄"],
    stations: [
      { name: "三ノ宮", reason: "県内最大級の結節点で、通勤と買い物の両面で基準になります。" },
      { name: "元町", reason: "旧居留地や南京町に近く、徒歩圏の生活利便が高いです。" },
      { name: "春日野道", reason: "都心近接の中で家賃を少し抑えたいときの比較に使えます。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "あり", gyomu: "あり" }
  },
  "神戸市東灘区": {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線", "六甲ライナー"],
    stations: [
      { name: "住吉", reason: "JRと六甲ライナーが使え、神戸都心と大阪の両方へ動きやすいです。" },
      { name: "摂津本山", reason: "JR沿線で住宅地の評価が安定しやすいです。" },
      { name: "岡本", reason: "阪急沿線の住環境を見たいときの代表駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "神戸市灘区": {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線", "神戸市営地下鉄", "六甲ライナー"],
    stations: [
      { name: "六甲道", reason: "JR沿線の中心で、日常利便と通勤のバランスが取りやすいです。" },
      { name: "王子公園", reason: "阪急とJRの距離感が良く、都心寄りの比較で使えます。" },
      { name: "摩耶", reason: "JR新駅で、灘区の中でも駅近を見たいときに使いやすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "神戸市兵庫区": {
    routes: ["JR神戸線", "神戸市営地下鉄", "神戸電鉄", "阪神本線"],
    stations: [
      { name: "兵庫", reason: "JRで都心と西側に動きやすく、家賃を抑えた駅近比較に向きます。" },
      { name: "新開地", reason: "阪神・神鉄・地下鉄の結節点で、乗換利便が高いです。" },
      { name: "湊川", reason: "地下鉄と神鉄の使い分けがしやすいエリアです。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "神戸市長田区": {
    routes: ["JR神戸線", "神戸市営地下鉄", "神戸高速線", "山陽電鉄"],
    stations: [
      { name: "新長田", reason: "JRと地下鉄が使え、買い物と通勤の両立を見やすい駅です。" },
      { name: "高速長田", reason: "地下鉄・高速線で都心近接を見やすいです。" },
      { name: "西代", reason: "山陽と地下鉄の接続を使いたいときの候補です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "神戸市須磨区": {
    routes: ["JR神戸線", "神戸市営地下鉄", "山陽電鉄本線"],
    stations: [
      { name: "須磨", reason: "海沿いの住環境とJRアクセスを両方見やすい駅です。" },
      { name: "名谷", reason: "地下鉄沿線の住宅地として比較しやすいです。" },
      { name: "妙法寺", reason: "区内で家賃と生活利便のバランスを見るときの候補です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "神戸市垂水区": {
    routes: ["JR神戸線", "山陽電鉄本線", "神戸市営地下鉄"],
    stations: [
      { name: "垂水", reason: "JRと山陽の使い分けがしやすく、生活圏の軸にしやすいです。" },
      { name: "舞子", reason: "明石海峡側のアクセスや景観を見たいときの代表駅です。" },
      { name: "学園都市", reason: "地下鉄沿線の住宅地を見たいときに使いやすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "神戸市北区": {
    routes: ["神戸電鉄有馬線", "神戸電鉄三田線", "神戸電鉄粟生線", "神戸市営地下鉄"],
    stations: [
      { name: "谷上", reason: "地下鉄と神鉄の接続点で、都心への出入り口として分かりやすいです。" },
      { name: "岡場", reason: "北区の生活拠点として見やすい駅です。" },
      { name: "鈴蘭台", reason: "北区内で中心的に比較しやすい駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "要確認" }
  },
  "神戸市西区": {
    routes: ["神戸市営地下鉄", "JR神戸線", "山陽電鉄本線", "神戸電鉄粟生線"],
    stations: [
      { name: "西神中央", reason: "西区の中心で、住宅地と大型商業の比較がしやすいです。" },
      { name: "伊川谷", reason: "神戸西側で家賃と通勤を両方見やすい駅です。" },
      { name: "学園都市", reason: "地下鉄沿線の住宅地として比較しやすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "尼崎市": {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線", "JR宝塚線"],
    stations: [
      { name: "尼崎", reason: "JRの中心で大阪通勤の軸にしやすいです。" },
      { name: "立花", reason: "市内で生活利便と家賃のバランスを見やすい駅です。" },
      { name: "武庫之荘", reason: "住宅地の雰囲気を見たいときの代表駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "西宮市": {
    routes: ["JR神戸線", "阪急神戸線", "阪急今津線", "阪神本線"],
    stations: [
      { name: "西宮北口", reason: "阪急の結節点で、生活利便と通勤の両方が強いです。" },
      { name: "夙川", reason: "住宅地の雰囲気と阪急沿線の比較に向きます。" },
      { name: "甲子園", reason: "阪神沿線で買い物と通勤を見やすい駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "芦屋市": {
    routes: ["JR神戸線", "阪急神戸線", "阪神本線"],
    stations: [
      { name: "芦屋", reason: "JR中心で都心アクセスと駅前利便を見やすいです。" },
      { name: "芦屋川", reason: "阪急沿線の静かな住宅地を見たいときの代表駅です。" },
      { name: "打出", reason: "阪神沿線で家賃と住環境のバランスを見やすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "要確認", gyomu: "あり" }
  },
  "伊丹市": {
    routes: ["JR福知山線", "阪急伊丹線"],
    stations: [
      { name: "伊丹", reason: "JR側のアクセスを重視する比較に向きます。" },
      { name: "新伊丹", reason: "阪急沿線で落ち着いた住宅地を見たいときに使えます。" },
      { name: "稲野", reason: "周辺の家賃と生活利便を比較しやすい駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "明石市": {
    routes: ["JR神戸線", "山陽電鉄本線"],
    stations: [
      { name: "明石", reason: "JRと駅前商業が強く、生活利便の軸になります。" },
      { name: "西明石", reason: "新快速停車駅として通勤重視で見やすいです。" },
      { name: "大久保", reason: "住宅地と買い物のバランスを見やすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "加古川市": {
    routes: ["JR神戸線", "JR加古川線", "山陽電鉄本線"],
    stations: [
      { name: "加古川", reason: "市の中心駅で、広域通勤と商業の軸にしやすいです。" },
      { name: "東加古川", reason: "学生・単身・生活利便を見やすい駅です。" },
      { name: "別府", reason: "沿線生活と買い物圏を見たいときの候補です。" }
    ],
    stores: { maruhachi: "あり", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "高砂市": {
    routes: ["JR神戸線", "山陽電鉄本線"],
    stations: [
      { name: "宝殿", reason: "JR沿線で姫路・加古川どちらも見やすい駅です。" },
      { name: "伊保", reason: "山陽沿線の生活圏を見たいときに向きます。" },
      { name: "荒井", reason: "駅近の比較で押さえやすい候補です。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "三木市": {
    routes: ["神戸電鉄粟生線"],
    stations: [
      { name: "志染", reason: "神鉄沿線の中で利用者が多く、生活圏の軸にしやすいです。" },
      { name: "緑が丘", reason: "住宅地の雰囲気を見たいときに使えます。" },
      { name: "恵比須", reason: "市内中心側の比較で押さえやすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "あり", gyomu: "あり" }
  },
  "川西市": {
    routes: ["JR福知山線", "阪急宝塚本線", "能勢電鉄妙見線"],
    stations: [
      { name: "川西能勢口", reason: "阪急と能勢電の接続点で、買い物と通勤の軸にしやすいです。" },
      { name: "川西池田", reason: "JR利用の比較で見やすい駅です。" },
      { name: "多田", reason: "能勢電沿線の住宅地を見たいときに向きます。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "要確認", gyomu: "あり" }
  },
  "宝塚市": {
    routes: ["JR福知山線", "阪急宝塚本線", "阪急今津線"],
    stations: [
      { name: "宝塚", reason: "JRと阪急の使い分けがしやすく、生活圏の中心になります。" },
      { name: "逆瀬川", reason: "阪急沿線の住宅地比較で見やすい駅です。" },
      { name: "中山観音", reason: "家賃と落ち着いた住環境のバランスを見る候補です。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "要確認", gyomu: "あり" }
  },
  "三田市": {
    routes: ["JR福知山線", "神戸電鉄三田線"],
    stations: [
      { name: "三田", reason: "JRと神鉄の軸で、通勤と買い物の両方を見やすいです。" },
      { name: "新三田", reason: "JR沿線で比較しやすい代表駅です。" },
      { name: "フラワータウン", reason: "ニュータウン住宅地として押さえやすいです。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "あり", gyomu: "あり" }
  },
  "猪名川町": {
    routes: ["能勢電鉄日生線"],
    stations: [
      { name: "日生中央", reason: "町内で最重要の拠点駅です。" }
    ],
    stores: { maruhachi: "あり", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "姫路市": {
    routes: ["JR神戸線", "山陽新幹線", "JR播但線", "JR姫新線", "山陽電鉄本線"],
    stations: [
      { name: "姫路", reason: "新幹線と在来線が集まり、広域通勤の基準になります。" },
      { name: "英賀保", reason: "西側の住宅地や家賃を見たいときに使いやすいです。" },
      { name: "東姫路", reason: "駅近の新しめの比較で押さえやすいです。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "あり", gyomu: "あり" }
  },
  "相生市": {
    routes: ["JR山陽本線", "JR赤穂線", "山陽新幹線"],
    stations: [
      { name: "相生", reason: "新幹線と在来線を見やすい市の中心駅です。" },
      { name: "西相生", reason: "沿線の暮らしや家賃を見たいときに向きます。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "あり", gyomu: "あり" }
  },
  "赤穂市": {
    routes: ["JR赤穂線"],
    stations: [
      { name: "播州赤穂", reason: "市の中心駅で、生活動線の起点になります。" },
      { name: "坂越", reason: "海沿いの暮らしを見たいときの候補です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "あり", gyomu: "あり" }
  },
  "たつの市": {
    routes: ["JR山陽本線", "JR姫新線"],
    stations: [
      { name: "本竜野", reason: "市の中心で、姫路方面とのつながりを見やすいです。" },
      { name: "竜野", reason: "JR沿線の比較で押さえやすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "西脇市": {
    routes: ["JR加古川線"],
    stations: [
      { name: "西脇市", reason: "市の中心駅で、通勤と買い物の基準にしやすいです。" },
      { name: "新西脇", reason: "沿線の住みやすさを見たいときに向きます。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "加西市": {
    routes: ["北条鉄道"],
    stations: [
      { name: "北条町", reason: "北条鉄道の中心で、市内比較の軸になります。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "小野市": {
    routes: ["神戸電鉄粟生線", "JR加古川線"],
    stations: [
      { name: "小野", reason: "市の中心で、生活圏の軸にしやすいです。" },
      { name: "粟生", reason: "神鉄とJRの接続を見やすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "あり" }
  },
  "加東市": {
    routes: ["JR加古川線", "北条鉄道"],
    stations: [
      { name: "滝野", reason: "JR沿線の比較で押さえやすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "丹波篠山市": {
    routes: ["JR福知山線"],
    stations: [
      { name: "篠山口", reason: "丹波篠山の主要駅で、広域移動の基準になります。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "あり", gyomu: "要確認" }
  },
  "丹波市": {
    routes: ["JR福知山線", "JR加古川線"],
    stations: [
      { name: "柏原", reason: "市の中心で、丹波地域の比較軸にしやすいです。" },
      { name: "石生", reason: "JR沿線の住みやすさを見る候補です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "朝来市": {
    routes: ["JR播但線"],
    stations: [
      { name: "和田山", reason: "朝来市の主要駅で、生活拠点として見やすいです。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "豊岡市": {
    routes: ["JR山陰本線"],
    stations: [
      { name: "豊岡", reason: "但馬の中心駅で、地域内移動の軸になります。" },
      { name: "城崎温泉", reason: "観光と生活圏の分かれ方を見るときに使えます。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "香美町": {
    routes: ["JR山陰本線"],
    stations: [
      { name: "香住", reason: "町内の中心拠点として見やすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "新温泉町": {
    routes: ["JR山陰本線"],
    stations: [
      { name: "浜坂", reason: "町内の中心拠点として見やすい駅です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "洲本市": {
    routes: ["鉄道なし", "路線バス", "高速バス"],
    stations: [
      { name: "中心市街", reason: "鉄道ではなくバス中心で見る必要があります。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "南あわじ市": {
    routes: ["鉄道なし", "路線バス", "高速バス"],
    stations: [
      { name: "中心市街", reason: "鉄道がないため、バス動線で比較します。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "淡路市": {
    routes: ["鉄道なし", "路線バス", "高速バス"],
    stations: [
      { name: "中心市街", reason: "鉄道がないため、バスと車での動線が基準です。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  },
  "福崎町": {
    routes: ["JR播但線"],
    stations: [
      { name: "福崎", reason: "播但線の中心駅で、姫路方面とのつながりを見やすいです。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "あり", gyomu: "要確認" }
  },
  "太子町": {
    routes: ["JR山陽本線", "路線バス"],
    stations: [
      { name: "網干", reason: "姫路方面へのアクセスを基準にしやすいです。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "要確認", gyomu: "要確認" }
  },
  "播磨町": {
    routes: ["JR神戸線", "山陽電鉄本線"],
    stations: [
      { name: "播磨町", reason: "町内の中心駅として押さえやすいです。" },
      { name: "土山", reason: "JR利用で神戸・明石方面を見やすいです。" }
    ],
    stores: { maruhachi: "要確認", marui: "あり", lamu: "要確認", gyomu: "あり" }
  },
  "稲美町": {
    routes: ["鉄道なし", "路線バス"],
    stations: [
      { name: "中心部", reason: "鉄道がないため、車移動前提で比較します。" }
    ],
    stores: { maruhachi: "要確認", marui: "要確認", lamu: "要確認", gyomu: "要確認" }
  }
};

function profileFor(area) {
  const region = regionDefaults[area.region] || {};
  const specific = areaProfiles[area.name] || {};
  const routes = specific.routes || region.routes || [];
  const stations = specific.stations || [];
  const stores = {
    maruhachi: "要確認",
    marui: "要確認",
    lamu: "要確認",
    gyomu: "要確認",
    ...(region.stores || {}),
    ...(specific.stores || {})
  };
  return { routes, stations, stores };
}

const metricMeta = {
  rentValue: { label: "家賃", unit: "想定家賃" },
  rentScore: { label: "家賃余力", unit: "10段階評価" },
  access: { label: "交通", unit: "10段階評価" },
  safety: { label: "治安", unit: "10段階評価" },
  commerce: { label: "商業", unit: "10段階評価" },
  disaster: { label: "災害危険度", unit: "10段階評価" },
  dailyShopping: { label: "日常買物", unit: "10段階評価" },
  cheapChains: { label: "安価チェーン密度", unit: "10段階評価" },
  residentTax: { label: "住民税負担", unit: "10段階評価" },
  childcare: { label: "子育て支援", unit: "10段階評価" },
  hospitals: { label: "病院（推定）", unit: "10段階評価" },
  landPrice: { label: "土地価格", unit: "10段階評価" },
  condoPrice: { label: "マンション価格", unit: "10段階評価" },
  overall: { label: "総合", unit: "10段階評価" },
  lifestyle: { label: "住環境バランス", unit: "10段階評価" }
};

const bedroomLabels = {
  studio: "1K",
  oneLdk: "1LDK",
  twoLdk: "2LDK"
};

const codeToAreaName = {
  28101: "神戸市東灘区",
  28102: "神戸市灘区",
  28105: "神戸市兵庫区",
  28106: "神戸市長田区",
  28107: "神戸市須磨区",
  28108: "神戸市垂水区",
  28109: "神戸市北区",
  28110: "神戸市中央区",
  28111: "神戸市西区",
  28201: "姫路市",
  28202: "尼崎市",
  28203: "明石市",
  28204: "西宮市",
  28205: "洲本市",
  28206: "芦屋市",
  28207: "伊丹市",
  28208: "相生市",
  28209: "豊岡市",
  28210: "加古川市",
  28212: "赤穂市",
  28213: "西脇市",
  28214: "宝塚市",
  28215: "三木市",
  28216: "高砂市",
  28217: "川西市",
  28218: "小野市",
  28219: "三田市",
  28220: "加西市",
  28221: "丹波篠山市",
  28222: "養父市",
  28223: "丹波市",
  28224: "南あわじ市",
  28225: "朝来市",
  28226: "淡路市",
  28227: "宍粟市",
  28228: "加東市",
  28229: "たつの市",
  28301: "猪名川町",
  28365: "多可町",
  28381: "稲美町",
  28382: "播磨町",
  28442: "市川町",
  28443: "福崎町",
  28446: "神河町",
  28464: "太子町",
  28481: "上郡町",
  28501: "佐用町",
  28585: "香美町",
  28586: "新温泉町"
};

const state = {
  metric: "rentValue",
  bedroom: "oneLdk",
  selectedName: "神戸市中央区",
  query: "",
  maxRent: 7.0
};

const elements = {
  map: document.querySelector("#map"),
  mapSearch: document.querySelector("#mapSearch"),
  searchToggle: document.querySelector("#searchToggle"),
  search: document.querySelector("#areaSearch"),
  pinchHint: document.querySelector("#pinchHint"),
  pinchHintClose: document.querySelector("#pinchHintClose"),
  tabs: document.querySelectorAll(".metric-tab"),
  metricUnit: document.querySelector("#metricUnit"),
  resetView: document.querySelector("#resetView"),
  legend: document.querySelector("#legend"),
  mapStatus: document.querySelector("#mapStatus"),
  railLegend: document.querySelector("#railLegend"),
  metricColorHelp: document.querySelector("#metricColorHelp"),
  rentRange: document.querySelector("#rentRange"),
  rentRangeValue: document.querySelector("#rentRangeValue"),
  bedroomTabs: document.querySelectorAll(".bedroom-tab"),
  selectedRegion: document.querySelector("#selectedRegion"),
  selectedName: document.querySelector("#selectedName"),
  selectedScore: document.querySelector("#selectedScore"),
  rentValue: document.querySelector("#rentValue"),
  rentStudioValue: document.querySelector("#rentStudioValue"),
  rentOneLdkValue: document.querySelector("#rentOneLdkValue"),
  rentTwoLdkValue: document.querySelector("#rentTwoLdkValue"),
  populationValue: document.querySelector("#populationValue"),
  incomeValue: document.querySelector("#incomeValue"),
  listedCompanyValue: document.querySelector("#listedCompanyValue"),
  safetyValue: document.querySelector("#safetyValue"),
  commerceValue: document.querySelector("#commerceValue"),
  disasterValue: document.querySelector("#disasterValue"),
  supermarketValue: document.querySelector("#supermarketValue"),
  convenienceValue: document.querySelector("#convenienceValue"),
  priceValue: document.querySelector("#priceValue"),
  discountStoreValue: document.querySelector("#discountStoreValue"),
  drugstoreValue: document.querySelector("#drugstoreValue"),
  uniqloValue: document.querySelector("#uniqloValue"),
  guValue: document.querySelector("#guValue"),
  electronicsValue: document.querySelector("#electronicsValue"),
  izakayaValue: document.querySelector("#izakayaValue"),
  restaurantValue: document.querySelector("#restaurantValue"),
  residentTaxValue: document.querySelector("#residentTaxValue"),
  childcareValue: document.querySelector("#childcareValue"),
  hospitalValue: document.querySelector("#hospitalValue"),
  landPriceValue: document.querySelector("#landPriceValue"),
  condoPriceValue: document.querySelector("#condoPriceValue"),
  rentInsight: document.querySelector("#rentInsight"),
  safetyInsight: document.querySelector("#safetyInsight"),
  disasterInsight: document.querySelector("#disasterInsight"),
  shoppingInsight: document.querySelector("#shoppingInsight"),
  retailInsight: document.querySelector("#retailInsight"),
  lifestyleValue: document.querySelector("#lifestyleValue"),
  lifestyleInsight: document.querySelector("#lifestyleInsight"),
  storeGrid: document.querySelector("#storeGrid"),
  retailGrid: document.querySelector("#retailGrid"),
  chainGrid: document.querySelector("#chainGrid"),
  cheapChainSummary: document.querySelector("#cheapChainSummary"),
  commentForm: document.querySelector("#commentForm"),
  commentInput: document.querySelector("#commentInput"),
  commentList: document.querySelector("#commentList"),
  detailPanel: document.querySelector("#detailPanel"),
  selectedAreaDetail: document.querySelector("#selectedAreaDetail"),
  popularList: document.querySelector("#popularList"),
  selectedSummary: document.querySelector("#selectedSummary"),
  tagRow: document.querySelector("#tagRow"),
  zoomReset: document.querySelector("#zoomReset")
};

let map;
let boundaryLayer;
let labelLayer;
let svgMapLayer;
let stationLayer;
let svgStationLayer;
let isLeafletMapActive = false;
let mapMinZoom = null;
const commentStorageKey = "hyogoAreaComments";
const searchCollapsedStorageKey = "hyogoAreaSearchCollapsed";
const pinchHintStorageKey = "hyogoAreaPinchHintDismissed";
const svgMapView = {
  minX: 360,
  minY: 35,
  maxX: 1120,
  maxY: 915,
  // More zoomed-in initial view so the map feels larger on load.
  initial: { x: 460, y: 159, w: 560, h: 672 }
};
let svgZoomController = null;
const lockMapPan = true;

function setSearchCollapsed(collapsed) {
  document.body.classList.toggle("search-collapsed", collapsed);
  elements.searchToggle?.setAttribute("aria-expanded", String(!collapsed));
  try {
    localStorage.setItem(searchCollapsedStorageKey, collapsed ? "1" : "0");
  } catch {}
}

function initSearchCollapse() {
  if (!elements.mapSearch || !elements.searchToggle || !elements.search) return;

  let collapsed = false;
  try {
    const saved = localStorage.getItem(searchCollapsedStorageKey);
    if (saved === "1") collapsed = true;
    if (saved === "0") collapsed = false;
    if (saved == null) collapsed = window.innerWidth < 720;
  } catch {
    collapsed = window.innerWidth < 720;
  }
  setSearchCollapsed(collapsed);

  elements.searchToggle.addEventListener("click", () => {
    const nextCollapsed = !document.body.classList.contains("search-collapsed");
    setSearchCollapsed(nextCollapsed);
    if (!nextCollapsed) {
      elements.search.focus();
      elements.search.select?.();
    }
  });

  elements.search.addEventListener("focus", () => {
    if (document.body.classList.contains("search-collapsed")) {
      setSearchCollapsed(false);
    }
  });

  elements.search.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    elements.search.blur();
    setSearchCollapsed(true);
  });
}

function initPinchHint() {
  if (!elements.pinchHint) return;

  const likelyTouch =
    "ontouchstart" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    window.matchMedia?.("(pointer: coarse)")?.matches;

  if (!likelyTouch) return;

  try {
    if (localStorage.getItem(pinchHintStorageKey) === "1") return;
  } catch {}

  elements.pinchHint.hidden = false;

  const dismiss = () => {
    if (!elements.pinchHint || elements.pinchHint.hidden) return;
    elements.pinchHint.hidden = true;
    try {
      localStorage.setItem(pinchHintStorageKey, "1");
    } catch {}
  };

  elements.pinchHintClose?.addEventListener("click", dismiss);

  // Hide when user actually starts using pinch/zoom gestures.
  const mapEl = elements.map;
  const onTouch = (event) => {
    if (event.touches && event.touches.length >= 2) dismiss();
  };
  mapEl?.addEventListener("touchstart", onTouch, { passive: true });

  // Auto-dismiss after a short time.
  window.setTimeout(dismiss, 8000);
}

const stationSystems = {
  jr: { label: "JR", color: "#1a5fd6", minZoomShow: 10, minZoomLabel: 11 },
  hankyu: { label: "阪急", color: "#6b4a2b", minZoomShow: 11, minZoomLabel: 12 },
  hanshin: { label: "阪神", color: "#f2c400", minZoomShow: 11, minZoomLabel: 12 },
  sanyo: { label: "山陽", color: "#d84b3f", minZoomShow: 11, minZoomLabel: 12 },
  subwayYamate: { label: "地下鉄(山手)", color: "#1aa85b", minZoomShow: 11, minZoomLabel: 12 },
  subwayKaigan: { label: "地下鉄(海岸)", color: "#1d70b8", minZoomShow: 11, minZoomLabel: 12 },
  portliner: { label: "ポートライナー", color: "#d1007a", minZoomShow: 11, minZoomLabel: 12 }
};

// 駅座標は「路線図（rosenzu.net）」の緯度経度一覧を元にしています。
const jrKobeStations = [
  { name: "尼崎", lat: 34.731629, lng: 135.431687 },
  { name: "立花", lat: 34.737961, lng: 135.399121 },
  { name: "甲子園口", lat: 34.738952, lng: 135.374704 },
  { name: "西宮", lat: 34.738763, lng: 135.347864 },
  { name: "さくら夙川", lat: 34.738988, lng: 135.331046 },
  { name: "芦屋", lat: 34.734243, lng: 135.30707 },
  { name: "甲南山手", lat: 34.730583, lng: 135.292427 },
  { name: "摂津本山", lat: 34.726683, lng: 135.276448 },
  { name: "住吉", lat: 34.7197379, lng: 135.2620131 },
  { name: "六甲道", lat: 34.714989, lng: 135.238507 },
  { name: "摩耶", lat: 34.708667, lng: 135.225167 },
  { name: "灘", lat: 34.706073, lng: 135.216439 },
  { name: "三ノ宮", lat: 34.694835, lng: 135.194944 },
  { name: "元町", lat: 34.689569, lng: 135.187373 },
  { name: "神戸", lat: 34.679526, lng: 135.178021 },
  { name: "兵庫", lat: 34.668379, lng: 135.164667 },
  { name: "新長田", lat: 34.657574, lng: 135.145124 },
  { name: "鷹取", lat: 34.651339, lng: 135.135203 },
  { name: "須磨海浜公園", lat: 34.647192, lng: 135.126623 },
  { name: "須磨", lat: 34.642273, lng: 135.112894 },
  { name: "塩屋", lat: 34.633693, lng: 135.08253 },
  { name: "垂水", lat: 34.62953, lng: 135.05363 },
  { name: "舞子", lat: 34.633484, lng: 135.033773 },
  { name: "朝霧", lat: 34.644394, lng: 135.017488 },
  { name: "明石", lat: 34.648748, lng: 134.993265 },
  { name: "西明石", lat: 34.666855, lng: 134.960542 },
  { name: "大久保", lat: 34.682297, lng: 134.938861 },
  { name: "魚住", lat: 34.696487, lng: 134.905975 },
  { name: "土山", lat: 34.720485, lng: 134.888874 },
  { name: "東加古川", lat: 34.745852, lng: 134.869039 },
  { name: "加古川", lat: 34.767844, lng: 134.839416 },
  { name: "宝殿", lat: 34.784545, lng: 134.81243 },
  { name: "曽根", lat: 34.793273, lng: 134.769915 },
  { name: "ひめじ別所", lat: 34.805552, lng: 134.753251 },
  { name: "御着", lat: 34.816944, lng: 134.735589 },
  { name: "東姫路", lat: 34.824361, lng: 134.712472 },
  { name: "姫路", lat: 34.827642, lng: 134.690849 }
].map((s) => ({
  ...s,
  system: "jr",
  lines: ["JR神戸線"],
  ...stationSystems.jr
}));

const hanshinMainStations = [
  { name: "尼崎", lat: 34.7182889, lng: 135.4167953 },
  { name: "出屋敷", lat: 34.718224, lng: 135.40454 },
  { name: "尼崎センタープール前", lat: 34.717991, lng: 135.395194 },
  { name: "武庫川", lat: 34.718068, lng: 135.383687 },
  { name: "鳴尾・武庫川女子大前", lat: 34.719684, lng: 135.37036 },
  { name: "甲子園", lat: 34.723898, lng: 135.363191 },
  { name: "久寿川", lat: 34.726956, lng: 135.356838 },
  { name: "今津", lat: 34.731008, lng: 135.351364 },
  { name: "西宮", lat: 34.7368742, lng: 135.338028 },
  { name: "香櫨園", lat: 34.734444, lng: 135.32916 },
  { name: "打出", lat: 34.731677, lng: 135.315961 },
  { name: "芦屋", lat: 34.7277357, lng: 135.3035477 },
  { name: "深江", lat: 34.722886, lng: 135.29163 },
  { name: "青木", lat: 34.717367, lng: 135.281318 },
  { name: "魚崎", lat: 34.712602, lng: 135.2692991 },
  { name: "住吉", lat: 34.712917, lng: 135.261683 },
  { name: "御影", lat: 34.714842, lng: 135.255626 },
  { name: "石屋川", lat: 34.713334, lng: 135.249501 },
  { name: "新在家", lat: 34.710618, lng: 135.24059 },
  { name: "大石", lat: 34.707623, lng: 135.231038 },
  { name: "西灘", lat: 34.705982, lng: 135.224978 },
  { name: "岩屋", lat: 34.704043, lng: 135.21777 },
  { name: "春日野道", lat: 34.6995653, lng: 135.2086104 },
  { name: "神戸三宮", lat: 34.693502, lng: 135.195104 },
  { name: "元町", lat: 34.689569, lng: 135.187373 }
].map((s) => ({
  ...s,
  system: "hanshin",
  lines: ["阪神本線"],
  ...stationSystems.hanshin
}));

const sanyoMainStations = [
  { name: "西代", lat: 34.662374, lng: 135.144085 },
  { name: "板宿", lat: 34.66006, lng: 135.133403 },
  { name: "東須磨", lat: 34.655138, lng: 135.127531 },
  { name: "月見山", lat: 34.649836, lng: 135.121579 },
  { name: "須磨寺", lat: 34.646447, lng: 135.116244 },
  { name: "山陽須磨", lat: 34.643423, lng: 135.112064 },
  { name: "須磨浦公園", lat: 34.637862, lng: 135.100351 },
  { name: "山陽塩屋", lat: 34.633693, lng: 135.08253 },
  { name: "滝の茶屋", lat: 34.630918, lng: 135.072048 },
  { name: "東垂水", lat: 34.629177, lng: 135.062929 },
  { name: "山陽垂水", lat: 34.62953, lng: 135.05363 },
  { name: "霞ヶ丘", lat: 34.630832, lng: 135.042345 },
  { name: "舞子公園", lat: 34.634109, lng: 135.034304 },
  { name: "西舞子", lat: 34.638489, lng: 135.028284 },
  { name: "大蔵谷", lat: 34.646535, lng: 135.008022 },
  { name: "人丸前", lat: 34.647548, lng: 135.002075 },
  { name: "山陽明石", lat: 34.648748, lng: 134.993265 },
  { name: "西新町", lat: 34.6497, lng: 134.981074 },
  { name: "林崎松江海岸", lat: 34.652022, lng: 134.965242 },
  { name: "藤江", lat: 34.663688, lng: 134.947349 },
  { name: "中八木", lat: 34.670721, lng: 134.936086 },
  { name: "江井ヶ島", lat: 34.6791583, lng: 134.9192526 },
  { name: "西江井ヶ島", lat: 34.6858724, lng: 134.9076948 },
  { name: "山陽魚住", lat: 34.689343, lng: 134.901681 },
  { name: "東二見", lat: 34.700017, lng: 134.888351 },
  { name: "西二見", lat: 34.707189, lng: 134.876855 },
  { name: "播磨町", lat: 34.716563, lng: 134.8681 },
  { name: "別府", lat: 34.730236, lng: 134.85058 },
  { name: "浜の宮", lat: 34.740857, lng: 134.833812 },
  { name: "尾上の松", lat: 34.748676, lng: 134.821171 },
  { name: "高砂", lat: 34.751853, lng: 134.803215 },
  { name: "荒井", lat: 34.75786, lng: 134.793816 },
  { name: "伊保", lat: 34.767343, lng: 134.786731 },
  { name: "山陽曽根", lat: 34.775547, lng: 134.772882 },
  { name: "大塩", lat: 34.779332, lng: 134.757906 },
  { name: "的形", lat: 34.779887, lng: 134.742053 },
  { name: "八家", lat: 34.784147, lng: 134.721886 },
  { name: "白浜の宮", lat: 34.786839, lng: 134.707273 },
  { name: "妻鹿", lat: 34.79228, lng: 134.692961 },
  { name: "飾磨", lat: 34.799798, lng: 134.674849 },
  { name: "亀山", lat: 34.810888, lng: 134.676857 },
  { name: "手柄", lat: 34.819962, lng: 134.681395 },
  { name: "山陽姫路", lat: 34.828822, lng: 134.689799 }
].map((s) => ({
  ...s,
  system: "sanyo",
  lines: ["山陽電鉄本線"],
  ...stationSystems.sanyo
}));

// 阪急神戸本線（兵庫県内の主要駅）
const hankyuKobeStations = [
  { name: "武庫之荘", lat: 34.751621, lng: 135.393118 },
  { name: "塚口", lat: 34.750974, lng: 135.424923 },
  { name: "園田", lat: 34.752002, lng: 135.448205 },
  { name: "西宮北口", lat: 34.745921, lng: 135.356663 },
  { name: "夙川", lat: 34.742162, lng: 135.328077 },
  { name: "芦屋川", lat: 34.736396, lng: 135.300585 },
  { name: "岡本", lat: 34.729107, lng: 135.275729 },
  { name: "御影", lat: 34.7245682, lng: 135.2520801 },
  { name: "六甲", lat: 34.71985, lng: 135.234388 },
  { name: "王子公園", lat: 34.710165, lng: 135.218375 },
  { name: "春日野道", lat: 34.703024, lng: 135.205374 },
  { name: "神戸三宮", lat: 34.693502, lng: 135.195104 }
].map((s) => ({
  ...s,
  system: "hankyu",
  lines: ["阪急神戸線"],
  ...stationSystems.hankyu
}));

// 阪急宝塚本線（兵庫県内の主要駅）
const hankyuTakarazukaStations = [
  { name: "川西能勢口", lat: 34.82764, lng: 135.413398 },
  { name: "雲雀丘花屋敷", lat: 34.827207, lng: 135.402413 },
  { name: "山本", lat: 34.821927, lng: 135.38847 },
  { name: "中山観音", lat: 34.819518, lng: 135.369235 },
  { name: "売布神社", lat: 34.815827, lng: 135.361297 },
  { name: "清荒神", lat: 34.811391, lng: 135.35329 },
  { name: "宝塚", lat: 34.81058, lng: 135.340777 }
].map((s) => ({
  ...s,
  system: "hankyu",
  lines: ["阪急宝塚線"],
  ...stationSystems.hankyu
}));

// 阪急今津線（兵庫県内の主要駅）
const hankyuImazuStations = [
  { name: "今津", lat: 34.7311652, lng: 135.3512656 },
  { name: "阪神国道", lat: 34.737186, lng: 135.354641 },
  { name: "西宮北口", lat: 34.745921, lng: 135.356663 },
  { name: "門戸厄神", lat: 34.757911, lng: 135.358216 },
  { name: "甲東園", lat: 34.767085, lng: 135.359788 },
  { name: "仁川", lat: 34.775242, lng: 135.356979 },
  { name: "小林", lat: 34.789005, lng: 135.352629 },
  { name: "逆瀬川", lat: 34.797684, lng: 135.350435 },
  { name: "宝塚南口", lat: 34.804189, lng: 135.345915 },
  { name: "宝塚", lat: 34.81058, lng: 135.340777 }
].map((s) => ({
  ...s,
  system: "hankyu",
  lines: ["阪急今津線"],
  ...stationSystems.hankyu
}));

// 神戸市営地下鉄 西神・山手線（主要駅）
const kobeSubwayYamateStations = [
  { name: "谷上", lat: 34.7618306, lng: 135.1713444 },
  { name: "新神戸", lat: 34.7052758, lng: 135.195735 },
  { name: "三宮", lat: 34.6938024, lng: 135.1921541 },
  { name: "県庁前", lat: 34.6909139, lng: 135.1838583 },
  { name: "大倉山", lat: 34.6846139, lng: 135.174525 },
  { name: "湊川公園", lat: 34.6793611, lng: 135.1672167 },
  { name: "上沢", lat: 34.67325, lng: 135.1583306 },
  { name: "長田", lat: 34.6684917, lng: 135.1515083 },
  { name: "新長田", lat: 34.6578204, lng: 135.1450445 },
  { name: "板宿", lat: 34.6598074, lng: 135.1347073 },
  { name: "妙法寺", lat: 34.6750444, lng: 135.1101194 },
  { name: "名谷", lat: 34.6793278, lng: 135.0942111 },
  { name: "総合運動公園", lat: 34.6817028, lng: 135.0757833 },
  { name: "学園都市", lat: 34.6815116, lng: 135.0575028 },
  { name: "伊川谷", lat: 34.6878861, lng: 135.0413639 },
  { name: "西神南", lat: 34.699405, lng: 135.03018306 },
  { name: "西神中央", lat: 34.7194694, lng: 135.0174472 }
].map((s) => ({
  ...s,
  system: "subwayYamate",
  lines: ["地下鉄西神・山手線"],
  ...stationSystems.subwayYamate
}));

// 神戸市営地下鉄 海岸線
const kobeSubwayKaiganStations = [
  { name: "新長田", lat: 34.6578204, lng: 135.1450445 },
  { name: "駒ヶ林", lat: 34.6521056, lng: 135.1495528 },
  { name: "苅藻", lat: 34.65365, lng: 135.1565972 },
  { name: "御崎公園", lat: 34.6547472, lng: 135.1654518 },
  { name: "和田岬", lat: 34.6568778, lng: 135.1746861 },
  { name: "中央市場前", lat: 34.6661972, lng: 135.1758639 },
  { name: "ハーバーランド", lat: 34.6785361, lng: 135.1787111 },
  { name: "みなと元町", lat: 34.6856171, lng: 135.1836241 },
  { name: "旧居留地・大丸前", lat: 34.689575, lng: 135.190675 },
  { name: "三宮・花時計前", lat: 34.6916277, lng: 135.1955709 }
].map((s) => ({
  ...s,
  system: "subwayKaigan",
  lines: ["地下鉄海岸線"],
  ...stationSystems.subwayKaigan
}));

// 神戸新交通 ポートアイランド線（ポートライナー）
const portlinerStations = [
  { name: "三宮", lat: 34.6945454, lng: 135.1952558 },
  { name: "貿易センター", lat: 34.6893944, lng: 135.1994556 },
  { name: "ポートターミナル", lat: 34.6813861, lng: 135.2023028 },
  { name: "中公園", lat: 34.67325, lng: 135.2073944 },
  { name: "みなとじま", lat: 34.6690667, lng: 135.2099944 },
  { name: "市民広場", lat: 34.6649, lng: 135.2124611 },
  { name: "南公園", lat: 34.6646278, lng: 135.2169722 },
  { name: "中埠頭", lat: 34.6694181, lng: 135.217128 },
  { name: "北埠頭", lat: 34.6735502, lng: 135.2146618 },
  { name: "医療センター", lat: 34.6584624, lng: 135.2164079 },
  { name: "計算科学センター", lat: 34.6547587, lng: 135.2216126 },
  { name: "神戸空港", lat: 34.6371944, lng: 135.2289528 }
].map((s) => ({
  ...s,
  system: "portliner",
  lines: ["ポートライナー"],
  ...stationSystems.portliner
}));

const majorStations = [
  ...jrKobeStations,
  ...hanshinMainStations,
  ...sanyoMainStations,
  ...hankyuKobeStations,
  ...hankyuTakarazukaStations,
  ...hankyuImazuStations,
  ...kobeSubwayYamateStations,
  ...kobeSubwayKaiganStations,
  ...portlinerStations
];

function roundRent(value) {
  return Math.round(value * 10) / 10;
}

function selectedRent(area) {
  return area.rent[state.bedroom];
}

function rentScore(area) {
  return clamp(Math.round(112 - selectedRent(area) * 8.8), 25, 98);
}

function ratingFrom100(value) {
  return clamp(Math.round(value / 10), 1, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function overall(area) {
  const score100 = Math.round(
    rentScore(area) * 0.52 +
      area.access * 0.18 +
      area.safety * 0.14 +
      area.commerce * 0.1 +
      area.lifestyle * 0.06
  );
  return ratingFrom100(score100);
}

function disasterRisk(area) {
  let risk = 3;
  const coastalNames = [
    "神戸市中央区",
    "神戸市兵庫区",
    "神戸市長田区",
    "神戸市須磨区",
    "神戸市垂水区",
    "尼崎市",
    "西宮市",
    "芦屋市",
    "明石市",
    "加古川市",
    "高砂市",
    "相生市",
    "赤穂市",
    "洲本市",
    "淡路市",
    "南あわじ市",
    "香美町",
    "新温泉町"
  ];
  if (coastalNames.includes(area.name)) risk += 2;
  if (["淡路", "但馬"].includes(area.region)) risk += 2;
  if (["丹波", "北播磨", "西播磨", "中播磨"].includes(area.region)) risk += 1;
  if (area.name.includes("北区") || area.tags.includes("自然")) risk += 1;
  return clamp(risk, 1, 10);
}

function supermarketRating(area) {
  return clamp(Math.round(area.commerce / 10 + (area.region.includes("阪神") ? 1 : 0)), 1, 10);
}

function convenienceRating(area) {
  return clamp(Math.round(area.access / 11 + area.commerce / 30), 1, 10);
}

function priceRating(area) {
  const rentFactor = ratingFrom100(rentScore(area));
  const expensivePenalty = area.name === "芦屋市" || area.name === "神戸市中央区" ? -2 : 0;
  return clamp(rentFactor + expensivePenalty, 1, 10);
}

function discountStoreRating(area) {
  return clamp(Math.round((priceRating(area) + supermarketRating(area)) / 2), 1, 10);
}

function drugstoreRating(area) {
  return clamp(Math.round((area.commerce + area.access) / 20), 1, 10);
}

function dailyShoppingRating(area) {
  return clamp(
    Math.round(
      supermarketRating(area) * 0.28 +
        convenienceRating(area) * 0.2 +
        priceRating(area) * 0.22 +
        discountStoreRating(area) * 0.16 +
        drugstoreRating(area) * 0.14
    ),
    1,
    10
  );
}

function hasDiscountStore(area) {
  return discountStoreRating(area) >= 6;
}

function cheapChainDensityPer10k(area) {
  const pop = area.stats?.population;
  const total = area.stats?.cheapChainTotal;
  if (pop == null || pop <= 0 || total == null) return null;
  return (total / pop) * 10000;
}

function inferredCheapChains(area) {
  // Fallback heuristic when Overpass counts are missing (e.g. boundaries not loaded / request failed).
  // Calibrated to produce small ints for rural areas, larger for urban.
  const base = area.commerce * 0.06 + area.access * 0.03 + (area.region.includes("阪神") ? 1.2 : 0);
  return Math.max(0, Math.round(base));
}

function cheapChainRating(area) {
  const density = cheapChainDensityPer10k(area);
  if (density == null) {
    // Use heuristic as last resort so the metric is still selectable.
    const inferred = inferredCheapChains(area);
    return clamp(Math.round(inferred / 1.4) + 1, 1, 10);
  }
  // Typical density range (per 1万人) is small; use a gentle curve.
  // 0.2 -> 2, 0.6 -> 5, 1.2 -> 8, 1.8+ -> 10
  const score = 1 + Math.round(9 * (1 - Math.exp(-density / 0.55)));
  return clamp(score, 1, 10);
}

const retailOverrides = {
  神戸市中央区: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 520, restaurants: 1800 },
  神戸市東灘区: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 110, restaurants: 520 },
  神戸市灘区: { uniqlo: "あり", gu: "要確認", electronics: "あり", izakaya: 130, restaurants: 560 },
  神戸市兵庫区: { uniqlo: "要確認", gu: "要確認", electronics: "あり", izakaya: 115, restaurants: 430 },
  神戸市長田区: { uniqlo: "要確認", gu: "要確認", electronics: "要確認", izakaya: 85, restaurants: 330 },
  神戸市須磨区: { uniqlo: "あり", gu: "要確認", electronics: "要確認", izakaya: 70, restaurants: 340 },
  神戸市垂水区: { uniqlo: "あり", gu: "あり", electronics: "要確認", izakaya: 90, restaurants: 420 },
  神戸市北区: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 70, restaurants: 360 },
  神戸市西区: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 80, restaurants: 400 },
  姫路市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 420, restaurants: 1450 },
  尼崎市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 260, restaurants: 950 },
  西宮市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 240, restaurants: 980 },
  明石市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 190, restaurants: 720 },
  芦屋市: { uniqlo: "あり", gu: "要確認", electronics: "要確認", izakaya: 60, restaurants: 300 },
  伊丹市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 120, restaurants: 520 },
  宝塚市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 110, restaurants: 520 },
  川西市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 95, restaurants: 430 },
  三田市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 80, restaurants: 360 },
  加古川市: { uniqlo: "あり", gu: "あり", electronics: "あり", izakaya: 160, restaurants: 650 },
  高砂市: { uniqlo: "要確認", gu: "要確認", electronics: "要確認", izakaya: 55, restaurants: 240 },
  洲本市: { uniqlo: "あり", gu: "要確認", electronics: "要確認", izakaya: 70, restaurants: 280 }
};

function roundToNearest(value, unit) {
  return Math.max(unit, Math.round(value / unit) * unit);
}

function inferredRetailState(area, threshold) {
  if (area.commerce >= threshold) return "あり";
  if (area.commerce >= threshold - 18) return "要確認";
  return "少なめ";
}

function retailProfile(area) {
  const override = retailOverrides[area.name] || {};
  const baseIzakaya = roundToNearest(area.commerce * 2.4 + area.access * 0.9 + (area.region.includes("阪神") ? 45 : 0), 10);
  const baseRestaurants = roundToNearest(area.commerce * 7.2 + area.access * 2.1 + (area.region.includes("阪神") ? 120 : 0), 20);
  return {
    uniqlo: override.uniqlo || inferredRetailState(area, 62),
    gu: override.gu || inferredRetailState(area, 66),
    electronics: override.electronics || inferredRetailState(area, 70),
    izakaya: override.izakaya || baseIzakaya,
    restaurants: override.restaurants || baseRestaurants
  };
}

function countDisplay(count) {
  if (count >= 1000) return `推定${Math.round(count / 100) * 100}件`;
  if (count >= 100) return `推定${Math.round(count / 10) * 10}件`;
  return `推定${count}件`;
}

function actualCountDisplay(count) {
  return count == null ? "--店" : `${count}店`;
}

function actualFacilityDisplay(count) {
  return count == null ? "--件" : `${count}件`;
}

function cheapChainSummary(area) {
  const stats = area.stats || {};
  const values = [
    ["マクドナルド", stats.mcdonalds],
    ["吉野家", stats.yoshinoya],
    ["すき家", stats.sukiya],
    ["松屋", stats.matsuya],
    ["サイゼリヤ", stats.saizeriya]
  ];

  const anyLoading = values.some(([, count]) => count == null);
  const found = values.filter(([, count]) => typeof count === "number" && count > 0).map(([label]) => label);
  const none =
    values.every(([, count]) => typeof count === "number") && values.every(([, count]) => (count ?? 0) === 0);

  if (anyLoading) {
    return "安価チェーンは集計中です（読み込み後に反映されます）。";
  }
  if (found.length) {
    return `この市町村で見つかった安価チェーン: ${found.join("・")}。`;
  }
  if (none) {
    return "この市町村では対象の安価チェーンが少なめ（0件）として集計されています。近隣市の利用も含めて確認してください。";
  }
  return "安価チェーンは状況を要確認です。";
}

function populationDisplay(population) {
  if (population == null) return "約--万人";
  if (population >= 10000) return `約${(population / 10000).toFixed(1)}万人`;
  return `約${population.toLocaleString()}人`;
}

function incomeDisplay(income) {
  return income == null ? "約--万円" : `約${income}万円`;
}

function listedCompanyDisplay(count) {
  return count == null ? "--社" : `${count}社`;
}

function textMatchesAny(text, patterns) {
  const normalized = text.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function chainText(tags = {}) {
  return [tags.name, tags.brand, tags.operator].filter(Boolean).join(" ");
}

const homeCenterPatterns = [
  "コーナン",
  "カインズ",
  "Cainz",
  "DCM",
  "ナフコ",
  "コメリ",
  "ビバホーム",
  "ムサシ",
  "アヤハディオ",
  "ジュンテンドー",
  "ロイヤルホームセンター",
  "ホームセンター"
];

const restaurantChainPatterns = {
  mcdonalds: ["マクドナルド", "McDonald", "McDonald's", "McDonalds"],
  yoshinoya: ["吉野家", "Yoshinoya", "YOSHINOYA"],
  sukiya: ["すき家", "Sukiya", "SUKIYA"],
  matsuya: ["松屋", "Matsuya", "MATSUYA"],
  saizeriya: ["サイゼリヤ", "サイゼリア", "Saizeriya", "SAIZERIYA"]
};

function classifyChain(tags = {}) {
  const text = chainText(tags);
  if (tags.shop === "doityourself" || tags.shop === "hardware" || textMatchesAny(text, homeCenterPatterns)) {
    return "homeCenters";
  }
  if (textMatchesAny(text, restaurantChainPatterns.mcdonalds)) return "mcdonalds";
  if (textMatchesAny(text, restaurantChainPatterns.yoshinoya)) return "yoshinoya";
  if (textMatchesAny(text, restaurantChainPatterns.sukiya)) return "sukiya";
  if (textMatchesAny(text, restaurantChainPatterns.matsuya)) return "matsuya";
  if (textMatchesAny(text, restaurantChainPatterns.saizeriya)) return "saizeriya";
  return null;
}

function residentTaxRating(area) {
  // Proxy: higher household income => higher resident tax burden.
  const income = area.stats?.householdIncome;
  if (income == null) {
    // fallback: higher rentScore => higher affordability => often higher income areas.
    return clamp(Math.round((ratingFrom100(area.commerce) + ratingFrom100(area.access)) / 2), 1, 10);
  }
  // 330万円台 -> 3, 450 -> 5, 570 -> 7, 720 -> 10
  const score = 1 + Math.round(((income - 320) / 45));
  return clamp(score, 1, 10);
}

function childcareSupportRating(area) {
  // Proxy: safety + lifestyle + access; coastal/urban slightly better access, but not always.
  const base = (ratingFrom100(area.safety) + ratingFrom100(area.lifestyle) + ratingFrom100(area.access)) / 3;
  const bonus = area.name.startsWith("神戸市") ? 1 : 0;
  return clamp(Math.round(base + bonus), 1, 10);
}

function hospitalEstimate(area) {
  const medical = area.stats || {};
  if (medical.medicalTotal != null) return medical.medicalTotal;
  const pop = area.stats?.population;
  if (pop == null) return null;
  // fallback only when OSM counts are missing
  const uplift = area.commerce >= 80 ? 10 : area.commerce >= 70 ? 5 : 0;
  return Math.max(1, Math.round((pop / 10000) * 2.2 + uplift));
}

function hospitalRating(area) {
  const count = hospitalEstimate(area);
  if (count == null) return clamp(Math.round((ratingFrom100(area.commerce) + ratingFrom100(area.access)) / 2), 1, 10);
  // 10->4, 30->7, 60->9, 90->10
  const score = 1 + Math.round(9 * (1 - Math.exp(-count / 28)));
  return clamp(score, 1, 10);
}

function landPriceRating(area) {
  // Proxy: higher rent + higher commerce tends to mean expensive land.
  // Here we show "地価の手頃さ" (higher is cheaper).
  const rentMan = selectedRent(area);
  const rentExpensive = clamp(Math.round((rentMan - 5.0) * 2.2), 0, 10);
  const commerceExpensive = clamp(Math.round((ratingFrom100(area.commerce) - 5) * 1.6), 0, 10);
  const expensive = clamp(Math.round((rentExpensive + commerceExpensive) / 2), 0, 10);
  return clamp(10 - expensive, 1, 10);
}

function condoPriceRating(area) {
  // Proxy: "マンション価格の手頃さ" (higher is cheaper).
  // Stronger penalty for high rent & high commerce; mild penalty for high access.
  if (condoPriceByArea[area.name]?.avgPriceManYen != null) {
    // Real data: higher avg price => lower affordability score.
    const price = condoPriceByArea[area.name].avgPriceManYen;
    // 1500万円 -> 10, 2500 -> 7, 3500 -> 4, 4500+ -> 1
    const expensive = clamp(Math.round((price - 1500) / 300) + 1, 0, 10);
    return clamp(11 - expensive, 1, 10);
  }
  const rentMan = selectedRent(area);
  const rentExpensive = clamp(Math.round((rentMan - 5.0) * 2.6), 0, 10);
  const commerceExpensive = clamp(Math.round((ratingFrom100(area.commerce) - 5) * 1.9), 0, 10);
  const accessExpensive = clamp(Math.round((ratingFrom100(area.access) - 5) * 0.9), 0, 10);
  const expensive = clamp(Math.round((rentExpensive * 0.5 + commerceExpensive * 0.35 + accessExpensive * 0.15)), 0, 10);
  return clamp(10 - expensive, 1, 10);
}

function condoPriceDisplay(area) {
  const entry = condoPriceByArea[area.name];
  if (!entry || entry.avgPriceManYen == null) return `${condoPriceRating(area)}/10`;
  const sampleText = entry.sampleSize ? `（${entry.sampleSize}件）` : "";
  const periodText = entry.period ? ` ${entry.period}` : "";
  return `平均${entry.avgPriceManYen.toLocaleString()}万円${sampleText}${periodText}`;
}

function metricValue(area, metric = state.metric) {
  if (metric === "rentValue") return selectedRent(area);
  if (metric === "rentScore") return ratingFrom100(rentScore(area));
  if (metric === "overall") return overall(area);
  if (metric === "disaster") return disasterRisk(area);
  if (metric === "dailyShopping") return dailyShoppingRating(area);
  if (metric === "cheapChains") return cheapChainRating(area);
  if (metric === "residentTax") return residentTaxRating(area);
  if (metric === "childcare") return childcareSupportRating(area);
  if (metric === "hospitals") return hospitalRating(area);
  if (metric === "landPrice") return landPriceRating(area);
  if (metric === "condoPrice") return condoPriceRating(area);
  if (metric === "lifestyle") return ratingFrom100(area.lifestyle);
  return ratingFrom100(area[metric]);
}

function metricDisplay(area, metric = state.metric) {
  if (metric === "rentValue") return `${selectedRent(area).toFixed(1)}万円`;
  return `${metricValue(area, metric)}/10`;
}

function rentInsight(area) {
  const rent = selectedRent(area);
  if (rent <= 5.5) return `${bedroomLabels[state.bedroom]}でかなり抑えやすい水準。車移動や生活圏が合うかを合わせて確認したいエリアです。`;
  if (rent <= 6.7) return `${bedroomLabels[state.bedroom]}で予算に収めやすい水準。利便性とのバランスを取りやすい候補です。`;
  if (rent <= 8.0) return "県内では中からやや高め。駅距離、築年数、面積を調整すると候補を広げられます。";
  return "県内では高めの家賃帯。利便性や住環境に対して予算を上げる価値があるかを見るエリアです。";
}

function safetyInsight(area) {
  if (area.safety >= 82) return "治安評価は高め。落ち着いた住環境を重視する候補として見やすいです。";
  if (area.safety >= 70) return "治安評価は標準からやや良好。駅周辺や夜間の雰囲気は個別確認が必要です。";
  return "治安評価は低めに見ています。町丁目、駅北南、繁華街との距離で細かく確認したいエリアです。";
}

function lifestyleInsight(area) {
  const score = ratingFrom100(area.lifestyle);
  if (score >= 8) {
    return "治安・商業・交通など暮らし要素のバランスがよく、住環境の総合感は高めの想定です。";
  }
  if (score >= 6) {
    return "住環境は標準〜やや良好。静けさ・駅近・家賃のどれを優先するかで候補が絞り込みやすいです。";
  }
  return "バランス面ではやや課題あり。通勤・買物・防災の優先順位を決めてから物件検索するとミスマッチを防げます。";
}

function disasterInsight(area) {
  const risk = disasterRisk(area);
  if (risk >= 8) return "災害危険度は高めの仮評価です。津波、浸水、土砂災害、雪、避難所距離を必ずハザードマップで確認してください。";
  if (risk >= 6) return "災害危険度は中からやや高めです。沿岸部、河川、山際、低地かどうかを住所単位で確認したいエリアです。";
  if (risk >= 4) return "災害危険度は標準的な仮評価です。物件選びでは浸水想定、土砂災害警戒区域、避難所を確認してください。";
  return "災害危険度は低めの仮評価です。ただし町丁目や建物位置で変わるため、最終判断はハザードマップで確認が必要です。";
}

function shoppingInsight(area) {
  const shopping = dailyShoppingRating(area);
  const discount = hasDiscountStore(area) ? "安いスーパー候補も見つけやすい想定です" : "安いスーパーは市内の場所次第で確認が必要です";
  if (shopping >= 8) return `スーパー・コンビニ・ドラッグストアの揃いやすさは高め。${discount}。`;
  if (shopping >= 6) return `日常買物はおおむね確保しやすい評価です。${discount}。`;
  return `日常買物はやや弱めの評価です。車移動、最寄りスーパー、ドラッグストアの距離を確認してください。`;
}

function retailInsight(area) {
  const retail = retailProfile(area);
  const apparel = retail.uniqlo === "あり" || retail.gu === "あり" ? "衣料品の大型店は使いやすい想定です" : "衣料品の大型店は周辺市も含めて確認したいです";
  const electronics = retail.electronics === "あり" ? "家電量販店も候補に入りやすいです" : "家電量販店は車移動や近隣市利用を見たいです";
  const food = retail.restaurants >= 700 ? "外食の選択肢は多め" : retail.restaurants >= 350 ? "外食は標準的" : "外食は少なめ";
  return `${apparel}。${electronics}。${food}で、居酒屋は${countDisplay(retail.izakaya)}の目安です。`;
}

function storeStateText(stateLabel) {
  if (stateLabel === "あり") return "あり";
  if (stateLabel === "なし") return "なし";
  return "要確認";
}

function renderStoreGrid(area) {
  const { stores } = profileFor(area);
  const order = [
    ["maruhachi", "マルハチ"],
    ["marui", "マルアイ"],
    ["lamu", "ラ・ムー"],
    ["gyomu", "業務スーパー"]
  ];
  elements.storeGrid.innerHTML = order
    .map(([key, label]) => {
      const stateLabel = storeStateText(stores[key]);
      const note =
        stateLabel === "あり"
          ? "店舗候補あり"
          : stateLabel === "なし"
            ? "店舗なし"
            : "近隣を要確認";
      return `
        <div class="store-pill" data-state="${stateLabel}">
          <strong>${label}</strong>
          <span>${stateLabel}</span>
          <small>${note}</small>
        </div>
      `;
    })
    .join("");
}

function renderRetailGrid(area) {
  const retail = retailProfile(area);
  const items = [
    ["ユニクロ", retail.uniqlo, retail.uniqlo === "あり" ? "店舗候補あり" : retail.uniqlo === "少なめ" ? "近隣市も確認" : "駅前・SCを確認"],
    ["GU", retail.gu, retail.gu === "あり" ? "店舗候補あり" : retail.gu === "少なめ" ? "近隣市も確認" : "駅前・SCを確認"],
    ["家電量販店", retail.electronics, retail.electronics === "あり" ? "店舗候補あり" : retail.electronics === "少なめ" ? "近隣市も確認" : "大型商業を確認"],
    ["居酒屋", countDisplay(retail.izakaya), "推定件数"],
    ["飲食店", countDisplay(retail.restaurants), "推定件数"]
  ];
  elements.retailGrid.innerHTML = items
    .map(
      ([label, stateLabel, note]) => `
        <div class="store-pill" data-state="${stateLabel}">
          <strong>${label}</strong>
          <span>${stateLabel}</span>
          <small>${note}</small>
        </div>
      `
    )
    .join("");
}

function renderChainGrid(area) {
  const chainStats = area.stats || {};
  const items = [
    ["ホームセンター", chainStats.homeCenters],
    ["マクドナルド", chainStats.mcdonalds],
    ["吉野家", chainStats.yoshinoya],
    ["すき家", chainStats.sukiya],
    ["松屋", chainStats.matsuya],
    ["サイゼリヤ", chainStats.saizeriya],
    ["安価チェーン合計", chainStats.cheapChainTotal]
  ];
  elements.chainGrid.innerHTML = items
    .map(
      ([label, count]) => `
        <div class="store-pill" data-state="count">
          <strong>${actualCountDisplay(count)}</strong>
          <span>${label}</span>
          <small>${count == null ? "集計中" : "実数"}</small>
        </div>
      `
    )
    .join("");
}

function readComments() {
  try {
    return JSON.parse(localStorage.getItem(commentStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function writeComments(commentsByArea) {
  localStorage.setItem(commentStorageKey, JSON.stringify(commentsByArea));
}

function commentsFor(areaName) {
  const commentsByArea = readComments();
  return commentsByArea[areaName] || [];
}

function formatCommentDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function renderComments(areaName) {
  const comments = commentsFor(areaName);
  if (!comments.length) {
    elements.commentList.innerHTML = '<p class="empty-comments">このエリアのコメントはまだありません。</p>';
    return;
  }
  elements.commentList.innerHTML = comments
    .map(
      (comment) => `
        <article class="comment-item">
          <p>${comment.text}</p>
          <div>
            <small>${formatCommentDate(comment.createdAt)}</small>
            <button class="comment-delete" type="button" data-comment-id="${comment.id}">削除</button>
          </div>
        </article>
      `
    )
    .join("");
}

function addComment(areaName, text) {
  const cleanText = text.trim();
  if (!cleanText) return;
  const commentsByArea = readComments();
  const nextComment = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: cleanText,
    createdAt: new Date().toISOString()
  };
  commentsByArea[areaName] = [nextComment, ...(commentsByArea[areaName] || [])].slice(0, 20);
  writeComments(commentsByArea);
  renderComments(areaName);
}

function deleteComment(areaName, commentId) {
  const commentsByArea = readComments();
  commentsByArea[areaName] = (commentsByArea[areaName] || []).filter((comment) => comment.id !== commentId);
  writeComments(commentsByArea);
  renderComments(areaName);
}

function colorFor(value) {
  if (value >= 8) return "#127c7a";
  if (value >= 7) return "#5f9f6e";
  if (value >= 6) return "#d9822b";
  return "#bc4b5f";
}

/** Lower monthly rent (万円) → greener fill; matches legend 割安側. */
function colorForRentMan(rentMan) {
  if (rentMan <= 5.5) return "#127c7a";
  if (rentMan <= 6.7) return "#5f9f6e";
  if (rentMan <= 8.0) return "#d9822b";
  return "#bc4b5f";
}

function colorForMetric(value, metric = state.metric) {
  if (metric === "disaster") {
    if (value >= 8) return "#bc4b5f";
    if (value >= 6) return "#d9822b";
    if (value >= 4) return "#5f9f6e";
    return "#127c7a";
  }
  if (metric === "rentValue") return colorForRentMan(value);
  return colorFor(value);
}

function filteredAreas() {
  const normalized = state.query.trim().toLowerCase();
  return areaData
    .filter((area) => {
      const matchesQuery =
        !normalized ||
        `${area.name} ${area.region} ${area.tags.join(" ")}`.toLowerCase().includes(normalized);
      const matchesRent = selectedRent(area) <= state.maxRent;
      return matchesQuery && matchesRent;
    })
    .sort((a, b) => {
      const diff = metricValue(a) - metricValue(b);
      return state.metric === "rentValue" ? diff : -diff;
    });
}

function popularityScore(area) {
  const rentBalance = rentScore(area);
  const disasterSafety = 100 - disasterRisk(area) * 10;
  return Math.round(area.lifestyle * 0.28 + area.safety * 0.22 + area.commerce * 0.2 + rentBalance * 0.2 + disasterSafety * 0.1);
}

function popularityReason(area) {
  const reasons = [];
  if (area.lifestyle >= 82) reasons.push("住環境");
  if (area.safety >= 78) reasons.push("治安");
  if (area.commerce >= 80) reasons.push("買物");
  if (selectedRent(area) <= 6.5) reasons.push("家賃");
  return reasons.slice(0, 2).join("・") || "バランス";
}

function popularAreas() {
  return [...areaData]
    .sort((a, b) => popularityScore(b) - popularityScore(a))
    .slice(0, 10);
}

function normalizeBoundaryName(feature) {
  const props = feature.properties || {};
  const rawId = props.id ?? props.code ?? props.N03_007 ?? feature.id ?? "";
  const digits = String(rawId).replace(/\D/g, "");
  const code = digits.length >= 5 ? digits.slice(0, 5) : "";
  if (code && codeToAreaName[code]) return codeToAreaName[code];
  const direct =
    props.name ||
    props.N03_004 ||
    props.city_name ||
    props.city ||
    props.shi ||
    props.ward ||
    props.label;
  if (!direct) return "";
  return String(direct).replace(/^兵庫県/, "").replace(/\s+/g, "");
}

function findAreaByFeature(feature) {
  const featureName = normalizeBoundaryName(feature);
  return (
    areaData.find((area) => area.name === featureName) ||
    areaData.find((area) => featureName.includes(area.name)) ||
    areaData.find((area) => area.name.includes(featureName))
  );
}

function shortName(name) {
  return name.replace("神戸市", "").replace("丹波篠山市", "丹波篠山");
}

const compactMapNames = {
  神戸市東灘区: "東灘区",
  神戸市灘区: "灘区",
  神戸市中央区: "中央区",
  神戸市兵庫区: "兵庫区",
  神戸市長田区: "長田区",
  神戸市須磨区: "須磨区",
  神戸市垂水区: "垂水区",
  神戸市北区: "北区",
  神戸市西区: "西区",
  尼崎市: "尼崎",
  西宮市: "西宮",
  芦屋市: "芦屋",
  伊丹市: "伊丹",
  宝塚市: "宝塚",
  川西市: "川西",
  猪名川町: "猪名川",
  明石市: "明石",
  加古川市: "加古川",
  高砂市: "高砂",
  播磨町: "播磨",
  稲美町: "稲美"
};

function mapLabelName(area) {
  return compactMapNames[area.name] || shortName(area.name);
}

const insetLabelPositions = {
  神戸市東灘区: [1015, 520],
  神戸市灘区: [1015, 546],
  神戸市中央区: [1015, 572],
  神戸市兵庫区: [1015, 598],
  神戸市長田区: [1015, 624],
  神戸市須磨区: [1015, 650],
  神戸市垂水区: [1015, 676],
  神戸市北区: [1100, 520],
  神戸市西区: [1100, 546],
  尼崎市: [1100, 572],
  西宮市: [1100, 598],
  芦屋市: [1100, 624],
  伊丹市: [1100, 650],
  宝塚市: [1100, 676],
  川西市: [1100, 702],
  猪名川町: [1100, 728]
};

const mapLabelOffsets = {
  神戸市東灘区: [28, -40],
  神戸市灘区: [28, -24],
  神戸市中央区: [30, -8],
  神戸市兵庫区: [30, 9],
  神戸市長田区: [30, 27],
  神戸市須磨区: [-92, 4],
  神戸市垂水区: [-96, 24],
  神戸市北区: [-100, -12],
  神戸市西区: [-92, -8],
  尼崎市: [26, -30],
  西宮市: [25, -10],
  芦屋市: [24, 12],
  伊丹市: [24, -42],
  宝塚市: [-82, -24],
  川西市: [26, -24],
  猪名川町: [26, -34],
  明石市: [-82, 24],
  加古川市: [-88, 6],
  高砂市: [-84, 26],
  播磨町: [-82, 43],
  稲美町: [-82, -18]
};

const mapImageTransform = {
  x: -28,
  y: -18,
  scaleX: 1672 / 1600,
  scaleY: 941 / 900
};

function mapLabelPlacement(area, x, y) {
  if (insetLabelPositions[area.name]) {
    const [labelX, labelY] = insetLabelPositions[area.name];
    return {
      x: labelX,
      y: labelY,
      hasLeader: true,
      isInset: true
    };
  }
  const [dx, dy] = mapLabelOffsets[area.name] || [area.name.startsWith("神戸市") ? 18 : 16, 4];
  return {
    x: x + dx,
    y: y + dy,
    hasLeader: Math.abs(dx) > 24 || Math.abs(dy) > 24
  };
}

function featureStyle(area) {
  const value = metricValue(area);
  return {
    color: "#ffffff",
    weight: 1.2,
    fillColor: colorForMetric(value),
    fillOpacity: area.name === state.selectedName ? 0.95 : 0.82
  };
}

function updateBoundaryStyles() {
  updateSvgBoundaryStyles();
  boundaryLayer?.eachLayer((layer) => {
    const area = layer.feature.__areaData;
    if (!area) return;
    layer.setStyle(featureStyle(area));
    if (area.name === state.selectedName) {
      layer.bringToFront();
    }
  });
  labelLayer?.eachLayer((layer) => {
    const area = layer.feature?.__areaData;
    if (!area) return;
    const selected = area.name === state.selectedName;
    layer.setStyle({
      radius: selected ? 6 : 4,
      fillColor: selected ? "#17211f" : colorForMetric(metricValue(area)),
      color: "#ffffff",
      weight: selected ? 2.4 : 1.6,
      fillOpacity: selected ? 0.95 : 0.85
    });
    layer.getTooltip()?.getElement()?.classList.toggle("selected", selected);
    if (selected) layer.bringToFront();
  });
}

function projectArea(area) {
  const lngMin = 134.3;
  const lngMax = 135.47;
  const latMin = 34.2;
  const latMax = 35.68;
  const baseX = 450 + ((area.lng - lngMin) / (lngMax - lngMin)) * 560;
  const baseY = 42 + ((latMax - area.lat) / (latMax - latMin)) * 828;
  const x = clamp(baseX, 430, 1040);
  const y = clamp(baseY, 36, 884);
  return {
    x: mapImageTransform.x + x * mapImageTransform.scaleX,
    y: mapImageTransform.y + y * mapImageTransform.scaleY
  };
}

function projectLonLat(lng, lat) {
  return projectArea({ lng, lat });
}

function updateSvgBoundaryStyles() {
  if (!svgMapLayer) return;
  svgMapLayer.querySelectorAll("[data-area-name]").forEach((node) => {
    const area = areaData.find((item) => item.name === node.dataset.areaName);
    if (!area) return;
    const value = metricValue(area);
    node.setAttribute("fill", colorForMetric(value));
    node.classList.toggle("selected", area.name === state.selectedName);
  });
}

function renderLegend() {
  let left = "低め";
  let right = "高め";
  if (state.metric === "rentValue") {
    left = "割高";
    right = "割安";
  } else if (state.metric === "disaster") {
    left = "高リスク";
    right = "低リスク";
  }
  const note =
    state.metric === "rentValue"
      ? "家賃は緑ほど安め"
      : state.metric === "disaster"
        ? "災害は緑ほど低リスク"
        : "スコアは緑ほど高評価";
  elements.legend.innerHTML = `
    <span class="legend-edge">${left}</span>
    <span class="legend-scale" aria-hidden="true"></span>
    <span class="legend-edge">${right}</span>
    <span class="legend-note">${note}</span>
  `;
}

function renderRailLegend() {
  if (!elements.railLegend) return;
  const entries = Object.entries(stationSystems).filter(([, meta]) => meta?.label && meta?.color);
  if (!entries.length) {
    elements.railLegend.innerHTML = "";
    return;
  }
  elements.railLegend.innerHTML = `
    <div class="rail-legend-title">鉄道カラー</div>
    <div class="rail-legend-items">
      ${entries
        .map(
          ([key, meta]) => `
            <div class="rail-legend-item" data-system="${key}">
              <span class="rail-legend-swatch" style="--swatch:${meta.color}"></span>
              <span>${meta.label}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderMetricColorHelp() {
  if (!elements.metricColorHelp) return;
  const metric = state.metric;

  const labels =
    metric === "rentValue"
      ? { rose: "高い", amber: "やや高い", green: "安い", teal: "かなり安い" }
      : metric === "disaster"
        ? { rose: "高リスク", amber: "やや高", green: "標準", teal: "低リスク" }
        : { rose: "低い", amber: "やや低い", green: "やや高い", teal: "高い" };

  const rows = [
    { color: "#bc4b5f", text: `赤=${labels.rose}` },
    { color: "#d9822b", text: `橙=${labels.amber}` },
    { color: "#5f9f6e", text: `黄緑=${labels.green}` },
    { color: "#127c7a", text: `緑=${labels.teal}` }
  ];

  elements.metricColorHelp.innerHTML = `
    <div class="metric-color-help">
      <span class="metric-color-chip"><span class="metric-color-swatch" style="--swatch:${rows[0].color}"></span>${rows[0].text}</span>
      <span class="metric-color-chip"><span class="metric-color-swatch" style="--swatch:${rows[1].color}"></span>${rows[1].text}</span>
      <span class="metric-color-chip"><span class="metric-color-swatch" style="--swatch:${rows[2].color}"></span>${rows[2].text}</span>
      <span class="metric-color-chip"><span class="metric-color-swatch" style="--swatch:${rows[3].color}"></span>${rows[3].text}</span>
      <span class="metric-color-chip">（横にスワイプで指標切替）</span>
    </div>
  `;
}

function renderPopularRanking() {
  if (!elements.popularList) return;
  elements.popularList.innerHTML = popularAreas()
    .map((area, index) => {
      const selected = area.name === state.selectedName;
      return `
        <button class="popular-item${selected ? " active" : ""}" type="button" data-area-name="${area.name}">
          <span class="popular-rank">${index + 1}</span>
          <span>
            <strong>${area.name}</strong>
            <small>${popularityReason(area)} / ${bedroomLabels[state.bedroom]} ${selectedRent(area).toFixed(1)}万円</small>
          </span>
          <b>${popularityScore(area)}</b>
        </button>
      `;
    })
    .join("");
}

function scrollDetailIntoView() {
  const target = elements.selectedAreaDetail || elements.detailPanel;
  if (!target) return;
  target.setAttribute("tabindex", "-1");
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && getComputedStyle(sidebar).display !== "contents") {
    sidebar.scrollTo({
      top: target.offsetTop - 8,
      behavior: "smooth"
    });
  }
  const top = target.getBoundingClientRect().top + window.scrollY - 8;
  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(() => target.focus({ preventScroll: true }), 120);
}

function selectArea(name, moveMap = false, scrollDetail = false) {
  const area = areaData.find((item) => item.name === name) || filteredAreas()[0] || areaData[0];
  state.selectedName = area.name;
  const score = overall(area);

  elements.mapStatus.textContent = `${area.name}を表示中`;
  elements.selectedRegion.textContent = area.region;
  elements.selectedName.textContent = area.name;
  elements.selectedScore.textContent = `${score}/10`;
  elements.selectedScore.style.background = colorFor(score);
  elements.rentValue.textContent = `${selectedRent(area).toFixed(1)}万円`;
  elements.rentStudioValue.textContent = `${area.rent.studio.toFixed(1)}万円`;
  elements.rentOneLdkValue.textContent = `${area.rent.oneLdk.toFixed(1)}万円`;
  elements.rentTwoLdkValue.textContent = `${area.rent.twoLdk.toFixed(1)}万円`;
  elements.populationValue.textContent = populationDisplay(area.stats?.population);
  elements.incomeValue.textContent = incomeDisplay(area.stats?.householdIncome);
  elements.listedCompanyValue.textContent = listedCompanyDisplay(area.stats?.listedCompanies);
  elements.safetyValue.textContent = `${ratingFrom100(area.safety)}/10`;
  elements.commerceValue.textContent = `${ratingFrom100(area.commerce)}/10`;
  elements.lifestyleValue.textContent = `${ratingFrom100(area.lifestyle)}/10`;
  elements.disasterValue.textContent = `${disasterRisk(area)}/10`;
  elements.supermarketValue.textContent = `${supermarketRating(area)}/10`;
  elements.convenienceValue.textContent = `${convenienceRating(area)}/10`;
  elements.priceValue.textContent = `${priceRating(area)}/10`;
  elements.discountStoreValue.textContent = hasDiscountStore(area) ? "有" : "要確認";
  elements.drugstoreValue.textContent = `${drugstoreRating(area)}/10`;
  const retail = retailProfile(area);
  elements.uniqloValue.textContent = retail.uniqlo;
  elements.guValue.textContent = retail.gu;
  elements.electronicsValue.textContent = retail.electronics;
  elements.izakayaValue.textContent = countDisplay(retail.izakaya);
  elements.restaurantValue.textContent = countDisplay(retail.restaurants);
  if (elements.residentTaxValue) elements.residentTaxValue.textContent = `${residentTaxRating(area)}/10`;
  if (elements.childcareValue) elements.childcareValue.textContent = `${childcareSupportRating(area)}/10`;
  if (elements.landPriceValue) elements.landPriceValue.textContent = `${landPriceRating(area)}/10`;
  if (elements.condoPriceValue) elements.condoPriceValue.textContent = condoPriceDisplay(area);
  if (elements.hospitalValue) {
    const stats = area.stats || {};
    if (stats.medicalTotal != null) {
      const suffix = stats.clinics != null && stats.hospitals != null ? `（病院${stats.hospitals}・診療所${stats.clinics}）` : "";
      elements.hospitalValue.textContent = `${stats.medicalTotal}件${suffix}`;
    } else {
      const count = hospitalEstimate(area);
      elements.hospitalValue.textContent = count == null ? "推定 --件" : `推定 ${count}件`;
    }
  }
  elements.selectedSummary.textContent = area.summary;
  elements.rentInsight.textContent = rentInsight(area);
  elements.safetyInsight.textContent = safetyInsight(area);
  elements.lifestyleInsight.textContent = lifestyleInsight(area);
  elements.disasterInsight.textContent = disasterInsight(area);
  elements.shoppingInsight.textContent = shoppingInsight(area);
  elements.retailInsight.textContent = retailInsight(area);
  elements.tagRow.innerHTML = area.tags.map((tag) => `<span>${tag}</span>`).join("");
  renderStoreGrid(area);
  renderRetailGrid(area);
  renderChainGrid(area);
  if (elements.cheapChainSummary) {
    elements.cheapChainSummary.textContent = cheapChainSummary(area);
  }
  elements.commentInput.value = "";
  renderComments(area.name);
  renderPopularRanking();

  if (moveMap && map) {
    const layer = boundaryLayer?.getLayers?.().find((item) => item.feature.__areaData?.name === area.name);
    if (layer) {
      map.fitBounds(layer.getBounds().pad(0.25), { animate: true });
    }
  }

  updateBoundaryStyles();
  if (scrollDetail) {
    window.setTimeout(scrollDetailIntoView, 80);
  }
}

function setSelectedFromFeature(feature, moveMap = false, scrollDetail = false) {
  const area = feature.__areaData;
  if (!area) return;
  selectArea(area.name, moveMap, scrollDetail);
}

function pointInLayerPart(point, part) {
  let inside = false;
  for (let i = 0, j = part.length - 1; i < part.length; j = i++) {
    const xi = part[i].x;
    const yi = part[i].y;
    const xj = part[j].x;
    const yj = part[j].y;
    const intersects = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInGeoRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInGeometry(point, geometry) {
  if (!geometry) return false;
  if (geometry.type === "Polygon") {
    const [outer, ...holes] = geometry.coordinates;
    if (!pointInGeoRing(point, outer)) return false;
    return !holes.some((hole) => pointInGeoRing(point, hole));
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon) => pointInGeometry(point, { type: "Polygon", coordinates: polygon }));
  }
  return false;
}

function osmPointForElement(element) {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return [element.lon, element.lat];
  }
  if (element.center && typeof element.center.lat === "number" && typeof element.center.lon === "number") {
    return [element.center.lon, element.center.lat];
  }
  return null;
}

function osmtags(element) {
  return element.tags || {};
}

function selectFeatureFromMapClick(event) {
  if (!boundaryLayer) return;
  let selectedFeature = null;
  boundaryLayer.eachLayer((layer) => {
    if (selectedFeature || !layer.getBounds?.().contains(event.latlng)) return;
    const point = map.latLngToLayerPoint(event.latlng);
    const parts = layer._parts || [];
    const inside = parts.some((part) => pointInLayerPart(point, part));
    if (inside) selectedFeature = layer.feature;
  });
  if (!selectedFeature) return;
  setSelectedFromFeature(selectedFeature, false, true);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function buildFallbackBoundaryLayer() {
  if (!window.L || !map) {
    buildSvgBoundaryLayer();
    return;
  }

  const layers = [];
  areaData.forEach((area) => {
    if (area.lat == null || area.lng == null) return;
    const feature = { type: "Feature", properties: {}, __areaData: area };
    const circle = L.circle([area.lat, area.lng], {
      radius: 4200,
      ...featureStyle(area)
    });
    circle.feature = feature;
    circle.on("click", () => selectArea(area.name, false, true));
    circle.bindTooltip(shortName(area.name), {
      permanent: true,
      direction: "center",
      className: "boundary-label"
    });
    layers.push(circle);
  });
  boundaryLayer?.remove();
  labelLayer?.remove();
  labelLayer = null;
  boundaryLayer = L.featureGroup(layers).addTo(map);
  if (layers.length) {
    map.fitBounds(boundaryLayer.getBounds().pad(0.03), { animate: false });
    map.setMaxBounds(boundaryLayer.getBounds().pad(0.02));
  }
  elements.mapStatus.textContent = "市区町村をクリック（境界未取得・簡易表示）";
  updateBoundaryStyles();
  selectArea(state.selectedName);
}

function buildAreaLabelLayer() {
  if (!window.L || !map) return;
  labelLayer?.remove();
  const markers = areaData
    .filter((area) => area.lat != null && area.lng != null)
    .map((area) => {
      const marker = L.circleMarker([area.lat, area.lng], {
        radius: 7,
        color: "#ffffff",
        weight: 1.6,
        fillColor: colorForMetric(metricValue(area)),
        fillOpacity: 0.85,
        pane: "markerPane"
      });
      marker.feature = { type: "Feature", properties: {}, __areaData: area };
      marker.bindTooltip(shortName(area.name), {
        permanent: true,
        direction: "center",
        className: "boundary-label boundary-point-label"
      });
      marker.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        selectArea(area.name, false, true);
      });
      return marker;
    });
  labelLayer = L.featureGroup(markers).addTo(map);
  updateBoundaryStyles();
}

function buildStationLayer() {
  if (!window.L || !map) return;
  stationLayer?.remove?.();

  const layers = majorStations.map((station) => {
    const showHint = stationSystems[station.system]?.label || "";
    const icon = L.divIcon({
      className: "station-div-icon",
      html: `<div class="station-pin" data-station-name="${station.name}" data-system="${station.system}" style="--station-color:${station.color}"><span class="dot"></span><span class="label">${station.name}</span></div>`,
      iconSize: [0, 0]
    });
    const marker = L.marker([station.lat, station.lng], { icon, keyboard: false });
    marker.__station = station;
    const lines = station.lines?.length ? station.lines.join("・") : "";
    const html = `<strong>${station.name}</strong><span class="sub">${showHint}${lines ? `・${lines}` : ""}</span>`;
    marker.bindTooltip(html, {
      permanent: false,
      direction: "top",
      offset: [0, -8],
      className: "station-tooltip",
      opacity: 0.98
    });
    return marker;
  });

  stationLayer = L.featureGroup(layers).addTo(map);
  updateStationVisibility();
  updateStationLabelOffsets();
}

function updateStationVisibility() {
  if (!map || !stationLayer) return;
  const zoom = map.getZoom?.() ?? 0;
  stationLayer.eachLayer((layer) => {
    const station = layer.__station;
    const el = layer.getElement?.();
    if (!station || !el) return;
    const shouldShow = zoom >= (station.minZoomShow ?? 10);
    el.style.display = shouldShow ? "" : "none";
    const pin = el.querySelector?.(".station-pin");
    if (pin) {
      pin.classList.toggle("show-label", zoom >= (station.minZoomLabel ?? 11));
    }
  });

  updateStationLabelOffsets();
}

function updateStationLabelOffsets() {
  if (!map || !stationLayer) return;
  if (!labelLayer) return;

  const zoom = map.getZoom?.() ?? 0;
  // When labels are hidden, offsets don't matter.
  if (zoom < 11) {
    stationLayer.eachLayer((layer) => {
      const el = layer.getElement?.();
      if (!el) return;
      el.style.removeProperty("--dx");
      el.style.removeProperty("--dy");
    });
    return;
  }

  const areaPoints = [];
  labelLayer.eachLayer((areaMarker) => {
    const ll = areaMarker.getLatLng?.();
    if (!ll) return;
    areaPoints.push(map.latLngToContainerPoint(ll));
  });
  if (!areaPoints.length) return;

  const maxDistance = 34; // px radius to treat as "overlap"
  const escape = 26; // px push away

  stationLayer.eachLayer((stationMarker) => {
    const el = stationMarker.getElement?.();
    const ll = stationMarker.getLatLng?.();
    if (!el || !ll) return;

    const p = map.latLngToContainerPoint(ll);
    let closest = null;
    let closestD2 = Infinity;

    for (const ap of areaPoints) {
      const dx = p.x - ap.x;
      const dy = p.y - ap.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < closestD2) {
        closestD2 = d2;
        closest = { dx, dy };
      }
    }

    if (!closest || closestD2 > maxDistance * maxDistance) {
      el.style.removeProperty("--dx");
      el.style.removeProperty("--dy");
      return;
    }

    // Push the station label away from the closest municipality marker.
    const len = Math.hypot(closest.dx, closest.dy) || 1;
    const nx = closest.dx / len;
    const ny = closest.dy / len;
    const dxPx = Math.round(nx * escape);
    const dyPx = Math.round(ny * escape);
    el.style.setProperty("--dx", `${dxPx}px`);
    el.style.setProperty("--dy", `${dyPx}px`);
  });
}

function fitMapToHyogo(animate = false) {
  if (!map || !boundaryLayer) return;
  // Slightly tighter padding so the initial view isn't too zoomed-out.
  map.fitBounds(boundaryLayer.getBounds().pad(0.02), { animate });
  window.setTimeout(() => {
    mapMinZoom = map.getZoom();
    map.setMinZoom(mapMinZoom);
    updateMapPanAbility();
  }, 0);
}

function updateMapPanAbility() {
  if (!map) return;
  if (!lockMapPan) return;
  const base = mapMinZoom ?? (map.getZoom?.() ?? 0);
  const zoom = map.getZoom?.() ?? 0;
  const canPan = zoom >= base + 0.5;
  if (canPan) {
    map.dragging?.enable?.();
  } else {
    map.dragging?.disable?.();
  }
}

function resetMapView() {
  if (map && boundaryLayer) {
    map.setMinZoom(0);
    fitMapToHyogo(true);
  } else {
    svgZoomController?.reset();
  }
}

function buildSvgBoundaryLayer() {
  isLeafletMapActive = false;
  boundaryLayer?.remove?.();
  boundaryLayer = null;
  labelLayer?.remove?.();
  labelLayer = null;
  svgStationLayer = null;
  const mapElement = elements.map;
  mapElement.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "hyogo-svg-map");
  svg.setAttribute(
    "viewBox",
    `${svgMapView.initial.x} ${svgMapView.initial.y} ${svgMapView.initial.w} ${svgMapView.initial.h}`
  );
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "兵庫県内の市区町村簡易地図");

  const sea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sea.setAttribute("class", "map-sea");
  sea.setAttribute("width", "1600");
  sea.setAttribute("height", "900");
  svg.appendChild(sea);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "image");
  background.setAttribute("href", "assets/hyogo-map-bg.png");
  background.setAttribute("x", "-28");
  background.setAttribute("y", "-18");
  background.setAttribute("width", "1672");
  background.setAttribute("height", "941");
  background.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.appendChild(background);

  areaData.forEach((area) => {
    if (area.lat == null || area.lng == null) return;
    const { x, y } = projectArea(area);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", area.name);
    group.dataset.areaName = area.name;
    group.style.cursor = "pointer";

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "boundary-fill");
    circle.dataset.areaName = area.name;
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", area.name.startsWith("神戸市") ? 10 : 15);
    circle.setAttribute("fill-opacity", "0.92");

    const labelPosition = mapLabelPlacement(area, x, y);
    if (labelPosition.hasLeader) {
      const leader = document.createElementNS("http://www.w3.org/2000/svg", "line");
      leader.setAttribute("class", "svg-label-leader");
      leader.setAttribute("x1", x);
      leader.setAttribute("y1", y);
      leader.setAttribute("x2", labelPosition.x - 8);
      leader.setAttribute("y2", labelPosition.y - 5);
      group.appendChild(leader);
    }

    const labelText = mapLabelName(area);
    let labelBox = null;
    if (labelPosition.isInset) {
      labelBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      labelBox.setAttribute("class", "svg-label-box");
      labelBox.dataset.areaName = area.name;
      labelBox.setAttribute("x", labelPosition.x - 9);
      labelBox.setAttribute("y", labelPosition.y - 18);
      labelBox.setAttribute("width", labelText.length >= 4 ? 74 : 58);
      labelBox.setAttribute("height", 24);
      labelBox.setAttribute("rx", 6);
      group.appendChild(labelBox);
    }

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "svg-area-label");
    label.setAttribute("x", labelPosition.x);
    label.setAttribute("y", labelPosition.y);
    label.setAttribute("font-size", area.name.startsWith("神戸市") ? "14" : "16");
    label.dataset.areaName = area.name;
    label.textContent = labelText;

    const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hitArea.setAttribute("class", "svg-hit-area");
    hitArea.dataset.areaName = area.name;
    hitArea.setAttribute("cx", x);
    hitArea.setAttribute("cy", y);
    hitArea.setAttribute("r", area.name.startsWith("神戸市") ? 32 : 40);

    group.append(hitArea, circle, label);
    const chooseArea = (event) => {
      event?.preventDefault();
      event?.stopPropagation();
      selectArea(area.name, false, true);
    };
    group.addEventListener("click", chooseArea);
    hitArea.addEventListener("click", chooseArea);
    circle.addEventListener("click", chooseArea);
    label.addEventListener("click", chooseArea);
    labelBox?.addEventListener("click", chooseArea);
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chooseArea();
      }
    });
    svg.appendChild(group);
  });

  const stationGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  stationGroup.setAttribute("aria-hidden", "true");
  majorStations.forEach((station) => {
    const { x, y } = projectLonLat(station.lng, station.lat);
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("class", "svg-station-dot");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 7);
    dot.setAttribute("fill", station.color || "#17211f");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "svg-station-label");
    label.setAttribute("x", x + 10);
    label.setAttribute("y", y + 5);
    label.textContent = station.name;

    stationGroup.append(dot, label);
  });
  svg.appendChild(stationGroup);

  mapElement.appendChild(svg);
  svgMapLayer = svg;
  svgStationLayer = stationGroup;
  svgZoomController = initSvgZoom(svg);
  elements.mapStatus.textContent = "市区町村をクリック（簡易地図表示）";
  updateSvgBoundaryStyles();
  selectArea(state.selectedName);
}

function ensureMapView() {
  if (!isLeafletMapActive && !map && !svgMapLayer) buildSvgBoundaryLayer();
}

async function loadBoundaryMap() {
  if (!window.L || !map || !window.topojson) {
    buildFallbackBoundaryLayer();
    return;
  }

  const urls = ["data/hyogo-boundaries.topojson"];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, url.startsWith("http") ? 3000 : 1000);
      if (!response.ok) continue;
      const topology = await response.json();
      const objectName = Object.keys(topology.objects)[0];
      const featureCollection = topojson.feature(topology, topology.objects[objectName]);
      for (const key of Object.keys(areaGeometries)) {
        delete areaGeometries[key];
      }
      const hyogoFeatures = featureCollection.features
        .map((feature) => {
          const area = findAreaByFeature(feature);
          if (!area) return null;
          areaGeometries[area.name] = feature.geometry;
          feature.__areaData = area;
          return feature;
        })
        .filter(Boolean);

      if (!hyogoFeatures.length) continue;

      const geojson = {
        type: "FeatureCollection",
        features: hyogoFeatures
      };

      boundaryLayer?.remove();
      labelLayer?.remove();
      labelLayer = null;
      boundaryLayer = L.geoJSON(geojson, {
        style: (feature) => featureStyle(feature.__areaData),
        onEachFeature: (feature, layer) => {
          layer.on("click", (event) => {
            L.DomEvent.stopPropagation(event);
            setSelectedFromFeature(feature, false, true);
          });
        }
      }).addTo(map);
      map.setMaxBounds(boundaryLayer.getBounds().pad(0.02));

      map.off("click", selectFeatureFromMapClick);
      map.on("click", selectFeatureFromMapClick);

      isLeafletMapActive = true;
      svgMapLayer = null;
      buildAreaLabelLayer();
      buildStationLayer();
      map.off("zoomend", updateStationVisibility);
      map.on("zoomend", updateStationVisibility);
      map.off("zoomend", updateMapPanAbility);
      map.on("zoomend", updateMapPanAbility);
      map.off("moveend", updateStationLabelOffsets);
      map.on("moveend", updateStationLabelOffsets);
      fitMapToHyogo(false);
      elements.mapStatus.textContent = "市区町村の面をクリック";
      updateBoundaryStyles();
      selectArea(state.selectedName);
      return;
    } catch (error) {
      // Try next source.
    }
  }

  buildFallbackBoundaryLayer();
}

function buildOverpassQuery({ shopPatterns = [], amenityPatterns = [], namePatterns = [], brandPatterns = [] }) {
  const [south, west, north, east] = hyogoOverpassBBox;
  const bbox = `${south},${west},${north},${east}`;
  const clauses = [];
  const patternsToRegex = (patterns) => patterns.join("|");
  if (shopPatterns.length) {
    clauses.push(`node["shop"~"${patternsToRegex(shopPatterns)}"](${bbox});`);
    clauses.push(`way["shop"~"${patternsToRegex(shopPatterns)}"](${bbox});`);
    clauses.push(`relation["shop"~"${patternsToRegex(shopPatterns)}"](${bbox});`);
  }
  if (namePatterns.length) {
    const regex = patternsToRegex(namePatterns);
    if (amenityPatterns.length) {
      clauses.push(`node["amenity"~"${patternsToRegex(amenityPatterns)}"]["name"~"${regex}",i](${bbox});`);
      clauses.push(`way["amenity"~"${patternsToRegex(amenityPatterns)}"]["name"~"${regex}",i](${bbox});`);
      clauses.push(`relation["amenity"~"${patternsToRegex(amenityPatterns)}"]["name"~"${regex}",i](${bbox});`);
    } else {
      clauses.push(`node["name"~"${regex}",i](${bbox});`);
      clauses.push(`way["name"~"${regex}",i](${bbox});`);
      clauses.push(`relation["name"~"${regex}",i](${bbox});`);
    }
  }
  if (brandPatterns.length) {
    const regex = patternsToRegex(brandPatterns);
    if (amenityPatterns.length) {
      clauses.push(`node["amenity"~"${patternsToRegex(amenityPatterns)}"]["brand"~"${regex}",i](${bbox});`);
      clauses.push(`way["amenity"~"${patternsToRegex(amenityPatterns)}"]["brand"~"${regex}",i](${bbox});`);
      clauses.push(`relation["amenity"~"${patternsToRegex(amenityPatterns)}"]["brand"~"${regex}",i](${bbox});`);
    } else {
      clauses.push(`node["brand"~"${regex}",i](${bbox});`);
      clauses.push(`way["brand"~"${regex}",i](${bbox});`);
      clauses.push(`relation["brand"~"${regex}",i](${bbox});`);
    }
  }
  return `
[out:json][timeout:90];
(${clauses.join("\n")});
out center tags;
`.trim();
}

const chainSources = [
  {
    key: "homeCenters",
    query: buildOverpassQuery({
      shopPatterns: ["doityourself", "hardware"],
      namePatterns: homeCenterPatterns,
      brandPatterns: homeCenterPatterns
    }),
    match: (tags) =>
      tags.shop === "doityourself" ||
      tags.shop === "hardware" ||
      textMatchesAny(chainText(tags), homeCenterPatterns)
  },
  {
    key: "mcdonalds",
    query: buildOverpassQuery({
      amenityPatterns: ["fast_food", "restaurant"],
      namePatterns: restaurantChainPatterns.mcdonalds,
      brandPatterns: restaurantChainPatterns.mcdonalds
    }),
    match: (tags) => textMatchesAny(chainText(tags), restaurantChainPatterns.mcdonalds)
  },
  {
    key: "yoshinoya",
    query: buildOverpassQuery({
      amenityPatterns: ["fast_food", "restaurant"],
      namePatterns: restaurantChainPatterns.yoshinoya,
      brandPatterns: restaurantChainPatterns.yoshinoya
    }),
    match: (tags) => textMatchesAny(chainText(tags), restaurantChainPatterns.yoshinoya)
  },
  {
    key: "sukiya",
    query: buildOverpassQuery({
      amenityPatterns: ["fast_food", "restaurant"],
      namePatterns: restaurantChainPatterns.sukiya,
      brandPatterns: restaurantChainPatterns.sukiya
    }),
    match: (tags) => textMatchesAny(chainText(tags), restaurantChainPatterns.sukiya)
  },
  {
    key: "matsuya",
    query: buildOverpassQuery({
      amenityPatterns: ["fast_food", "restaurant"],
      namePatterns: restaurantChainPatterns.matsuya,
      brandPatterns: restaurantChainPatterns.matsuya
    }),
    match: (tags) => textMatchesAny(chainText(tags), restaurantChainPatterns.matsuya)
  },
  {
    key: "saizeriya",
    query: buildOverpassQuery({
      amenityPatterns: ["fast_food", "restaurant"],
      namePatterns: restaurantChainPatterns.saizeriya,
      brandPatterns: restaurantChainPatterns.saizeriya
    }),
    match: (tags) => textMatchesAny(chainText(tags), restaurantChainPatterns.saizeriya)
  }
];

const medicalSources = [
  {
    key: "hospitals",
    query: buildOverpassQuery({
      amenityPatterns: ["hospital"]
    }),
    match: (tags) => tags.amenity === "hospital"
  },
  {
    key: "clinics",
    query: buildOverpassQuery({
      amenityPatterns: ["clinic"]
    }),
    match: (tags) => tags.amenity === "clinic"
  }
];

async function fetchOverpassCounts(query) {
  const response = await fetch(chainQueryEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: new URLSearchParams({ data: query })
  });
  if (!response.ok) {
    throw new Error(`Overpass request failed: ${response.status}`);
  }
  return response.json();
}

const chainCacheKey = "hyogoChainCountsCacheV1";
const chainCacheTtlMs = 1000 * 60 * 60 * 24 * 14; // 14 days

function readChainCache() {
  try {
    return JSON.parse(localStorage.getItem(chainCacheKey) || "null");
  } catch {
    return null;
  }
}

function writeChainCache(payload) {
  try {
    localStorage.setItem(chainCacheKey, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

function countChainsByArea(payloads) {
  const countsByArea = {};
  for (const area of areaData) {
    countsByArea[area.name] = {
      homeCenters: 0,
      mcdonalds: 0,
      yoshinoya: 0,
      sukiya: 0,
      matsuya: 0,
      saizeriya: 0,
      cheapChainTotal: 0
    };
  }

  for (const { source, elements } of payloads) {
    const seen = new Set();
    for (const element of elements) {
      const key = `${element.type}/${element.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const tags = osmtags(element);
      if (!source.match(tags)) continue;
      const point = osmPointForElement(element);
      if (!point) continue;

      for (const area of areaData) {
        const geometry = areaGeometries[area.name];
        if (!geometry || !pointInGeometry(point, geometry)) continue;
        countsByArea[area.name][source.key] += 1;
        if (source.key !== "homeCenters") {
          countsByArea[area.name].cheapChainTotal += 1;
        }
        break;
      }
    }
  }

  return countsByArea;
}

function applyChainCounts(countsByArea) {
  for (const area of areaData) {
    const counts = countsByArea[area.name];
    if (!counts) continue;
    const stats = areaStats[area.name];
    if (!stats) continue;
    stats.homeCenters = counts.homeCenters;
    stats.mcdonalds = counts.mcdonalds;
    stats.yoshinoya = counts.yoshinoya;
    stats.sukiya = counts.sukiya;
    stats.matsuya = counts.matsuya;
    stats.saizeriya = counts.saizeriya;
    stats.cheapChainTotal = counts.cheapChainTotal;
  }
}

function countMedicalByArea(payloads) {
  const countsByArea = {};
  for (const area of areaData) {
    countsByArea[area.name] = {
      hospitals: 0,
      clinics: 0,
      medicalTotal: 0
    };
  }

  for (const { source, elements } of payloads) {
    const seen = new Set();
    for (const element of elements) {
      const key = `${element.type}/${element.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const tags = osmtags(element);
      if (!source.match(tags)) continue;
      const point = osmPointForElement(element);
      if (!point) continue;

      for (const area of areaData) {
        const geometry = areaGeometries[area.name];
        if (!geometry || !pointInGeometry(point, geometry)) continue;
        countsByArea[area.name][source.key] += 1;
        countsByArea[area.name].medicalTotal += 1;
        break;
      }
    }
  }

  return countsByArea;
}

function applyMedicalCounts(countsByArea) {
  for (const area of areaData) {
    const counts = countsByArea[area.name];
    if (!counts) continue;
    const stats = areaStats[area.name];
    if (!stats) continue;
    stats.hospitals = counts.hospitals;
    stats.clinics = counts.clinics;
    stats.medicalTotal = counts.medicalTotal;
  }
}

async function loadChainCounts() {
  if (chainStatsLoading || chainStatsLoaded) return;
  if (!Object.keys(areaGeometries).length) return;
  chainStatsLoading = true;
  try {
    const cached = readChainCache();
    if (cached && typeof cached.savedAt === "number" && cached.countsByArea && Date.now() - cached.savedAt < chainCacheTtlMs) {
      applyChainCounts(cached.countsByArea);
      chainStatsLoaded = true;
      selectArea(state.selectedName);
      return;
    }

    const payloads = await Promise.allSettled(
      chainSources.map(async (source) => {
        const payload = await fetchOverpassCounts(source.query);
        return { source, elements: payload.elements || [] };
      })
    );
    const resolvedPayloads = payloads
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    if (!resolvedPayloads.length) {
      throw new Error("No overpass payloads resolved");
    }
    const countsByArea = countChainsByArea(resolvedPayloads);
    applyChainCounts(countsByArea);
    writeChainCache({ savedAt: Date.now(), countsByArea });
    chainStatsLoaded = true;
    selectArea(state.selectedName);
  } catch (error) {
    console.warn("Chain count aggregation failed", error);
  } finally {
    chainStatsLoading = false;
  }
}

const medicalCacheKey = "hyogoMedicalCountsCacheV1";
const medicalCacheTtlMs = 1000 * 60 * 60 * 24 * 14; // 14 days

function readMedicalCache() {
  try {
    return JSON.parse(localStorage.getItem(medicalCacheKey) || "null");
  } catch {
    return null;
  }
}

function writeMedicalCache(payload) {
  try {
    localStorage.setItem(medicalCacheKey, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

async function loadMedicalCounts() {
  if (medicalStatsLoading || medicalStatsLoaded) return;
  if (!Object.keys(areaGeometries).length) return;
  medicalStatsLoading = true;
  try {
    const cached = readMedicalCache();
    if (cached && typeof cached.savedAt === "number" && cached.countsByArea && Date.now() - cached.savedAt < medicalCacheTtlMs) {
      applyMedicalCounts(cached.countsByArea);
      medicalStatsLoaded = true;
      selectArea(state.selectedName);
      return;
    }

    const payloads = await Promise.allSettled(
      medicalSources.map(async (source) => {
        const payload = await fetchOverpassCounts(source.query);
        return { source, elements: payload.elements || [] };
      })
    );
    const resolvedPayloads = payloads
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    if (!resolvedPayloads.length) {
      throw new Error("No medical overpass payloads resolved");
    }
    const countsByArea = countMedicalByArea(resolvedPayloads);
    applyMedicalCounts(countsByArea);
    writeMedicalCache({ savedAt: Date.now(), countsByArea });
    medicalStatsLoaded = true;
    selectArea(state.selectedName);
  } catch (error) {
    console.warn("Medical count aggregation failed", error);
  } finally {
    medicalStatsLoading = false;
  }
}

function initMap() {
  if (!window.L) {
    buildSvgBoundaryLayer();
    return;
  }

  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    boxZoom: false,
    keyboard: false,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    maxBoundsViscosity: 1.0,
    preferCanvas: true,
    attributionControl: false
  }).setView([34.85, 134.95], 9.75);

  map.getContainer().style.background = "#eef6f4";
  bindLeafletZoomControls();
  updateMapPanAbility();
}

function bindLeafletZoomControls() {
  if (!elements.zoomReset) return;
  L.DomEvent.disableClickPropagation(elements.zoomReset);
  L.DomEvent.disableScrollPropagation(elements.zoomReset);
  elements.zoomReset.addEventListener("pointerdown", (event) => event.stopPropagation());
  elements.zoomReset.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
  elements.zoomReset.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetMapView();
  });
}

function bindEvents() {
  initSearchCollapse();
  initPinchHint();

  const resolveAreaFromQuery = (raw) => {
    const q = (raw || "").trim();
    if (!q) return null;
    const norm = q.replace(/\s+/g, "");
    const list = filteredAreas();
    const exact = list.find((a) => a.name.replace(/\s+/g, "") === norm);
    if (exact) return exact;
    const prefix = list.find((a) => a.name.replace(/\s+/g, "").startsWith(norm));
    if (prefix) return prefix;
    const contains = list.find((a) => a.name.replace(/\s+/g, "").includes(norm));
    return contains || null;
  };

  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.search.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const picked = resolveAreaFromQuery(elements.search.value);
    if (!picked) return;
    state.query = "";
    elements.search.value = "";
    render();
    // Move map + jump to detail panel so "検索→情報一覧" が成立する
    selectArea(picked.name, true, true);
    setSearchCollapsed(true);
  });

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      elements.tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      state.metric = tab.dataset.metric;
      render();
    });
  });

  elements.bedroomTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      elements.bedroomTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      state.bedroom = tab.dataset.bedroom;
      render();
    });
  });

  elements.rentRange.addEventListener("input", (event) => {
    state.maxRent = Number(event.target.value);
    render();
  });

  elements.popularList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-area-name]");
    if (!button) return;
    selectArea(button.dataset.areaName, true, true);
  });

  elements.commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addComment(state.selectedName, elements.commentInput.value);
    elements.commentInput.value = "";
  });

  elements.commentList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-comment-id]");
    if (!deleteButton) return;
    deleteComment(state.selectedName, deleteButton.dataset.commentId);
  });

  elements.resetView.addEventListener("click", () => {
    state.query = "";
    state.maxRent = 7.0;
    state.metric = "rentValue";
    state.bedroom = "oneLdk";
    elements.search.value = "";
    elements.rentRange.value = state.maxRent;
    elements.tabs.forEach((item) => item.classList.toggle("active", item.dataset.metric === state.metric));
    elements.bedroomTabs.forEach((item) => item.classList.toggle("active", item.dataset.bedroom === state.bedroom));
    render();
    if (map && boundaryLayer) {
      resetMapView();
    } else {
      svgZoomController?.reset();
    }
  });
}

function render() {
  ensureMapView();
  elements.metricUnit.textContent = metricMeta[state.metric].unit;
  elements.rentRangeValue.textContent = `${state.maxRent.toFixed(1)}万円以下`;
  const areas = filteredAreas();
  if (!areas.some((area) => area.name === state.selectedName)) {
    state.selectedName = areas[0]?.name || areaData[0].name;
  }
  renderLegend();
  renderMetricColorHelp();
  renderRailLegend();
  renderPopularRanking();
  selectArea(state.selectedName);
}

initMap();
bindEvents();
render();
loadBoundaryMap().then(() => {
  loadChainCounts();
  loadMedicalCounts();
});

if (window.lucide) {
  window.lucide.createIcons();
}
function initSvgZoom(svg) {
  const initial = { ...svgMapView.initial };
  const bounds = svgMapView;
  let vb = { ...initial };
  const minW = 260;
  const maxW = initial.w;
  const canPan = () => !lockMapPan || vb.w < maxW * 0.92;
  let activePointerId = null;
  let lastPoint = null;
  let dragStart = null;
  let hasDragged = false;

  const apply = () => {
    svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  };

  const clampView = () => {
    vb.w = Math.max(minW, Math.min(maxW, vb.w));
    vb.h = vb.w * (initial.h / initial.w);
    if (vb.h > initial.h) {
      vb.h = initial.h;
      vb.w = vb.h * (initial.w / initial.h);
    }
    vb.x = clamp(vb.x, bounds.minX, bounds.maxX - vb.w);
    vb.y = clamp(vb.y, bounds.minY, bounds.maxY - vb.h);
  };

  const screenToVb = (clientX, clientY) => {
    const rect = svg.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    return { x: vb.x + vb.w * px, y: vb.y + vb.h * py };
  };

  const zoomAt = (centerVb, factor) => {
    const cx = centerVb.x;
    const cy = centerVb.y;
    vb.x = cx - (cx - vb.x) * factor;
    vb.y = cy - (cy - vb.y) * factor;
    vb.w *= factor;
    clampView();
    apply();
  };

  const panByScreenDelta = (dx, dy) => {
    const rect = svg.getBoundingClientRect();
    vb.x -= (dx / rect.width) * vb.w;
    vb.y -= (dy / rect.height) * vb.h;
    clampView();
    apply();
  };

  const center = () => ({ x: vb.x + vb.w / 2, y: vb.y + vb.h / 2 });

  const reset = () => {
    vb = { ...initial };
    apply();
  };

  elements.zoomReset?.addEventListener("click", reset);

  svg.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const c = screenToVb(e.clientX, e.clientY);
      const factor = e.deltaY < 0 ? 0.88 : 1.12;
      zoomAt(c, factor);
    },
    { passive: false }
  );

  const pointers = new Map();
  let pinchStart = null;

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  svg.addEventListener("pointerdown", (e) => {
    svg.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    hasDragged = false;

    if (pointers.size === 1) {
      activePointerId = e.pointerId;
      lastPoint = { x: e.clientX, y: e.clientY };
      dragStart = { x: e.clientX, y: e.clientY };
      if (canPan()) svg.classList.add("dragging");
    }

    if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      pinchStart = {
        vb: { ...vb },
        d: dist(p1, p2),
        centerVb: screenToVb(mid.x, mid.y)
      };
    }
  });

  svg.addEventListener(
    "pointermove",
    (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (canPan() && pointers.size === 1 && e.pointerId === activePointerId && lastPoint) {
        const dx = e.clientX - lastPoint.x;
        const dy = e.clientY - lastPoint.y;
        const totalDx = e.clientX - (dragStart?.x ?? e.clientX);
        const totalDy = e.clientY - (dragStart?.y ?? e.clientY);
        if (hasDragged || Math.hypot(totalDx, totalDy) > 8) {
          e.preventDefault();
          hasDragged = true;
          panByScreenDelta(dx, dy);
        }
        lastPoint = { x: e.clientX, y: e.clientY };
        return;
      }

      if (pointers.size !== 2 || !pinchStart) return;

      e.preventDefault();

      const [p1, p2] = Array.from(pointers.values());
      const dNow = dist(p1, p2);
      if (pinchStart.d <= 0) return;

      const factor = pinchStart.d / dNow;

      vb = { ...pinchStart.vb };
      hasDragged = true;
      zoomAt(pinchStart.centerVb, factor);
    },
    { passive: false }
  );

  const endPinchIfNeeded = (id) => {
    pointers.delete(id);
    if (id === activePointerId) {
      activePointerId = null;
      lastPoint = null;
      dragStart = null;
    }
    if (pointers.size < 2) pinchStart = null;
    if (!pointers.size) svg.classList.remove("dragging");
  };

  svg.addEventListener(
    "click",
    (e) => {
      if (!hasDragged) return;
      e.preventDefault();
      e.stopPropagation();
      hasDragged = false;
    },
    true
  );

  svg.addEventListener("pointerup", (e) => endPinchIfNeeded(e.pointerId));
  svg.addEventListener("pointercancel", (e) => endPinchIfNeeded(e.pointerId));

  clampView();
  apply();
  return { reset };
}

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
];

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
  descending: false,
  query: "",
  maxRent: 7.0,
  commuteOnly: false
};

const elements = {
  map: document.querySelector("#map"),
  search: document.querySelector("#areaSearch"),
  tabs: document.querySelectorAll(".metric-tab"),
  list: document.querySelector("#areaList"),
  resultCount: document.querySelector("#resultCount"),
  metricUnit: document.querySelector("#metricUnit"),
  sortToggle: document.querySelector("#sortToggle"),
  commuteFilter: document.querySelector("#commuteFilter"),
  resetView: document.querySelector("#resetView"),
  legend: document.querySelector("#legend"),
  mapStatus: document.querySelector("#mapStatus"),
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
  safetyValue: document.querySelector("#safetyValue"),
  accessValue: document.querySelector("#accessValue"),
  commerceValue: document.querySelector("#commerceValue"),
  commuteValue: document.querySelector("#commuteValue"),
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
  rentInsight: document.querySelector("#rentInsight"),
  safetyInsight: document.querySelector("#safetyInsight"),
  accessInsight: document.querySelector("#accessInsight"),
  disasterInsight: document.querySelector("#disasterInsight"),
  shoppingInsight: document.querySelector("#shoppingInsight"),
  retailInsight: document.querySelector("#retailInsight"),
  lifestyleValue: document.querySelector("#lifestyleValue"),
  lifestyleInsight: document.querySelector("#lifestyleInsight"),
  routeRow: document.querySelector("#routeRow"),
  stationList: document.querySelector("#stationList"),
  storeGrid: document.querySelector("#storeGrid"),
  retailGrid: document.querySelector("#retailGrid"),
  commentForm: document.querySelector("#commentForm"),
  commentInput: document.querySelector("#commentInput"),
  commentList: document.querySelector("#commentList"),
  detailPanel: document.querySelector("#detailPanel"),
  selectedSummary: document.querySelector("#selectedSummary"),
  tagRow: document.querySelector("#tagRow")
};

let map;
let boundaryLayer;
let svgMapLayer;
const commentStorageKey = "hyogoAreaComments";

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

function metricValue(area, metric = state.metric) {
  if (metric === "rentValue") return selectedRent(area);
  if (metric === "rentScore") return ratingFrom100(rentScore(area));
  if (metric === "overall") return overall(area);
  if (metric === "disaster") return disasterRisk(area);
  if (metric === "dailyShopping") return dailyShoppingRating(area);
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

function accessInsight(area) {
  const accessText =
    area.access >= 82
      ? "交通アクセスは強い"
      : area.access >= 65
        ? "交通アクセスは標準的"
        : "交通アクセスは弱め";
  const commerceText =
    area.commerce >= 82
      ? "商業施設も充実"
      : area.commerce >= 60
        ? "日常商業は確保しやすい"
        : "商業施設は限定的";
  return `${accessText}で、${commerceText}です。通勤先と買い物動線をセットで見ると判断しやすいです。`;
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

function renderRoutes(area) {
  const { routes } = profileFor(area);
  if (!routes.length) {
    elements.routeRow.innerHTML = "<span>主要路線は要確認</span>";
    return;
  }
  elements.routeRow.innerHTML = routes.map((route) => `<span>${route}</span>`).join("");
}

function renderStations(area) {
  const { stations } = profileFor(area);
  if (!stations.length) {
    elements.stationList.innerHTML = '<div class="station-item"><strong>おすすめ駅は要確認</strong><small>駅距離と路線構成を個別に確認してください。</small></div>';
    return;
  }
  elements.stationList.innerHTML = stations
    .slice(0, 3)
    .map(
      (station) => `
        <div class="station-item">
          <strong>${station.name}</strong>
          <small>${station.reason}</small>
        </div>
      `
    )
    .join("");
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
      const matchesCommute = !state.commuteOnly || area.commute >= 80;
      return matchesQuery && matchesRent && matchesCommute;
    })
    .sort((a, b) => {
      const diff = metricValue(a) - metricValue(b);
      return state.descending ? -diff : diff;
    });
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
  if (!boundaryLayer) return;
  boundaryLayer.eachLayer((layer) => {
    const area = layer.feature.__areaData;
    if (!area) return;
    layer.setStyle(featureStyle(area));
    if (area.name === state.selectedName) {
      layer.bringToFront();
    }
  });
}

function projectArea(area) {
  const lngMin = 134.3;
  const lngMax = 135.47;
  const latMin = 34.2;
  const latMax = 35.68;
  const x = 450 + ((area.lng - lngMin) / (lngMax - lngMin)) * 560;
  const y = 42 + ((latMax - area.lat) / (latMax - latMin)) * 828;
  return {
    x: clamp(x, 430, 1040),
    y: clamp(y, 36, 884)
  };
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
  elements.legend.innerHTML = `
    <span>${left}</span>
    <span class="legend-scale"></span>
    <span>${right}</span>
  `;
}

function renderList(areas) {
  elements.resultCount.textContent = `${areas.length}件`;
  elements.list.innerHTML = "";

  areas.slice(0, 18).forEach((area) => {
    const button = document.createElement("button");
    const value = metricValue(area);
    button.className = `area-item${area.name === state.selectedName ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <div>
        <strong>${area.name}</strong>
        <small>${area.region} / ${bedroomLabels[state.bedroom]} ${selectedRent(area).toFixed(1)}万円 / ${metricMeta[state.metric].label}: ${metricDisplay(area)}</small>
      </div>
      <span class="item-score" style="background:${colorForMetric(value)}">${state.metric === "rentValue" ? selectedRent(area).toFixed(1) : value}</span>
    `;
    button.addEventListener("click", () => selectArea(area.name, true, true));
    elements.list.appendChild(button);
  });
}

function scrollDetailIntoView() {
  elements.detailPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  elements.safetyValue.textContent = `${ratingFrom100(area.safety)}/10`;
  elements.accessValue.textContent = `${ratingFrom100(area.access)}/10`;
  elements.commerceValue.textContent = `${ratingFrom100(area.commerce)}/10`;
  elements.commuteValue.textContent = `${ratingFrom100(area.commute)}/10`;
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
  elements.selectedSummary.textContent = area.summary;
  elements.rentInsight.textContent = rentInsight(area);
  elements.safetyInsight.textContent = safetyInsight(area);
  elements.lifestyleInsight.textContent = lifestyleInsight(area);
  elements.accessInsight.textContent = accessInsight(area);
  elements.disasterInsight.textContent = disasterInsight(area);
  elements.shoppingInsight.textContent = shoppingInsight(area);
  elements.retailInsight.textContent = retailInsight(area);
  elements.tagRow.innerHTML = area.tags.map((tag) => `<span>${tag}</span>`).join("");
  renderRoutes(area);
  renderStations(area);
  renderStoreGrid(area);
  renderRetailGrid(area);
  elements.commentInput.value = "";
  renderComments(area.name);

  if (moveMap && map) {
    const layer = boundaryLayer?.getLayers?.().find((item) => item.feature.__areaData?.name === area.name);
    if (layer) {
      map.fitBounds(layer.getBounds().pad(0.25), { animate: true });
      layer.openTooltip?.();
    }
  }

  renderList(filteredAreas());
  updateBoundaryStyles();
  if (scrollDetail) {
    window.requestAnimationFrame(scrollDetailIntoView);
  }
}

function setSelectedFromFeature(feature, moveMap = false, scrollDetail = false) {
  const area = feature.__areaData;
  if (!area) return;
  selectArea(area.name, moveMap, scrollDetail);
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
    circle.on("click", () => selectArea(area.name, true, true));
    circle.bindTooltip(shortName(area.name), {
      permanent: true,
      direction: "center",
      className: "boundary-label"
    });
    layers.push(circle);
  });
  boundaryLayer?.remove();
  boundaryLayer = L.featureGroup(layers).addTo(map);
  if (layers.length) {
    map.fitBounds(boundaryLayer.getBounds().pad(0.08), { animate: false });
  }
  elements.mapStatus.textContent = "市区町村をクリック（境界未取得・簡易表示）";
  updateBoundaryStyles();
  selectArea(state.selectedName);
}

function buildSvgBoundaryLayer() {
  boundaryLayer?.remove?.();
  boundaryLayer = null;
  const mapElement = elements.map;
  mapElement.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "hyogo-svg-map");
  svg.setAttribute("viewBox", "330 40 870 820");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "兵庫県内の市区町村簡易地図");

  const sea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sea.setAttribute("class", "map-sea");
  sea.setAttribute("width", "1600");
  sea.setAttribute("height", "900");
  svg.appendChild(sea);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "image");
  background.setAttribute("href", "assets/hyogo-map-bg.png");
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", "1600");
  background.setAttribute("height", "900");
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
    hitArea.setAttribute("r", area.name.startsWith("神戸市") ? 28 : 32);

    group.append(hitArea, circle, label);
    const chooseArea = () => selectArea(area.name, false, true);
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

  svg.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-area-name]");
    if (!target?.dataset?.areaName) return;
    event.preventDefault();
    selectArea(target.dataset.areaName, false, true);
  });

  mapElement.appendChild(svg);
  svgMapLayer = svg;
  elements.mapStatus.textContent = "市区町村をクリック（簡易地図表示）";
  updateSvgBoundaryStyles();
  selectArea(state.selectedName);
}

function ensureMapView() {
  if (!svgMapLayer) buildSvgBoundaryLayer();
}

async function loadBoundaryMap() {
  return;

  if (!window.L || !map || !window.topojson) {
    buildFallbackBoundaryLayer();
    return;
  }

  const urls = [
    "data/hyogo-boundaries.topojson",
    "https://geoshape.ex.nii.ac.jp/city/topojson/20230101/28/28_city.l.topojson"
  ];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, url.startsWith("http") ? 3000 : 1000);
      if (!response.ok) continue;
      const topology = await response.json();
      const objectName = Object.keys(topology.objects)[0];
      const featureCollection = topojson.feature(topology, topology.objects[objectName]);
      const hyogoFeatures = featureCollection.features
        .map((feature) => {
          const area = findAreaByFeature(feature);
          if (!area) return null;
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
      boundaryLayer = L.geoJSON(geojson, {
        style: (feature) => featureStyle(feature.__areaData),
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(shortName(feature.__areaData.name), {
            permanent: true,
            direction: "center",
            className: "boundary-label"
          });
          layer.on("click", () => setSelectedFromFeature(feature, true, true));
        }
      }).addTo(map);

      map.fitBounds(boundaryLayer.getBounds().pad(0.08), { animate: false });
      elements.mapStatus.textContent = "市区町村をクリック";
      updateBoundaryStyles();
      selectArea(state.selectedName);
      return;
    } catch (error) {
      // Try next source.
    }
  }

  buildFallbackBoundaryLayer();
}

function initMap() {
  buildSvgBoundaryLayer();
  return;

  if (!window.L) {
    elements.map.style.background = "#dce7e3";
    elements.mapStatus.textContent = "市区町村をクリック（簡易地図表示）";
    return;
  }

  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    preferCanvas: true,
    attributionControl: false
  }).setView([34.85, 134.95], 9);

  map.getContainer().style.background = "#f4efe4";
}

function bindEvents() {
  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      elements.tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      state.metric = tab.dataset.metric;
      state.descending = state.metric !== "rentValue";
      updateSortLabel();
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

  elements.sortToggle.addEventListener("click", () => {
    state.descending = !state.descending;
    updateSortLabel();
    render();
  });

  elements.commuteFilter.addEventListener("change", (event) => {
    state.commuteOnly = event.target.checked;
    render();
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
    state.commuteOnly = false;
    state.metric = "rentValue";
    state.bedroom = "oneLdk";
    state.descending = false;
    elements.search.value = "";
    elements.rentRange.value = state.maxRent;
    elements.commuteFilter.checked = false;
    elements.tabs.forEach((item) => item.classList.toggle("active", item.dataset.metric === state.metric));
    elements.bedroomTabs.forEach((item) => item.classList.toggle("active", item.dataset.bedroom === state.bedroom));
    updateSortLabel();
    render();
    if (map && boundaryLayer) {
      try {
        map.fitBounds(boundaryLayer.getBounds().pad(0.08), { animate: true });
      } catch (e) {
        map.setView([34.85, 134.95], 9);
      }
    }
  });
}

function updateSortLabel() {
  elements.sortToggle.querySelector("span").textContent = state.descending ? "高い順" : "安い順";
}

function render() {
  ensureMapView();
  elements.metricUnit.textContent = metricMeta[state.metric].unit;
  elements.rentRangeValue.textContent = `${state.maxRent.toFixed(1)}万円以下`;
  const areas = filteredAreas();
  if (!areas.some((area) => area.name === state.selectedName)) {
    state.selectedName = areas[0]?.name || areaData[0].name;
  }
  renderList(areas);
  renderLegend();
  selectArea(state.selectedName);
}

initMap();
bindEvents();
updateSortLabel();
render();
loadBoundaryMap();

if (window.lucide) {
  window.lucide.createIcons();
}

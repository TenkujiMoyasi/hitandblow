'use strict'
{
  const message_area = document.querySelector(".message_area");
  const start_area = document.querySelector(".start_area");
  const input_area = document.querySelector(".input_area");
  const answer = document.querySelector(".answer");
  const title = document.querySelector(".main_title");

  const history_log = document.querySelector(".history_log");

  const start_button = document.querySelector(".start_button");
  const input_button = document.querySelector(".input_button");

  let truth_100 = 0;
  let truth_10 = 0;
  let truth_1 = 0;
  let truth_number = 0;
  let challenge_time = 0;


  //全角数字を半角に変換
  function replace_narrow(str) {
    return str.replace(/[０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  //解答の生成
  function generate_numbers() {
    const numbers = [...Array(10).keys()]

    for (let i = numbers.length - 1; i >= 0; i--) {
      let x = Math.floor(Math.random() * i);
      [numbers[i], numbers[x]] = [numbers[x], numbers[i]]
    }
    truth_100 = numbers[0];
    truth_10 = numbers[1];
    truth_1 = numbers[2];

    truth_number = (truth_100 * 100 + truth_10 * 10 + truth_1);
    // console.log(truth_number);
  }

  //盤面リセット
  function game_reset() {
    start_area.classList.add("invisible");
    start_button.classList.remove("restart");
    start_button.textContent = "スタート";
    input_area.classList.remove("invisible");
    message_area.classList.remove("warn");
    title.classList.remove("warn");
    title.textContent = "Hit & Blow";
    challenge_time = 0;

    //履歴のリセット
    for (let n = 1; n <= 10; n++) {
      // console.log("run")
      history_log.children[n].children[1].textContent = "";
      history_log.children[n].children[2].textContent = "";
      history_log.children[n].children[3].textContent = "";
      answer.value = "";
    }
  }

  //ヒットチェック
  function hit_check(n) {
    let a_100 = Math.floor(n / 100 % 10)
    let a_10 = Math.floor(n / 10 % 10)
    let a_1 = Math.floor(n / 1 % 10)
    let hit_count = 0;

    if (truth_1 == a_1) {
      hit_count++;
    }
    if (truth_10 == a_10) {
      hit_count++;
    }
    if (truth_100 == a_100) {
      hit_count++;
    }
    return hit_count;
  }

  //ブローチェック
  function blow_check(n) {
    let a_100 = Math.floor(n / 100 % 10)
    let a_10 = Math.floor(n / 10 % 10)
    let a_1 = Math.floor(n / 1 % 10)
    let blow_count = 0;

    let t_n = [truth_100, truth_10, truth_1]

    if (t_n.indexOf(a_1) !== -1) {
      blow_count++;
    }
    if (t_n.indexOf(a_10) !== -1) {
      blow_count++;
    }
    if (t_n.indexOf(a_100) !== -1) {
      blow_count++;
    }
    return blow_count;
  }

  //履歴の記録
  function enter_record(a, b, c) {
    challenge_time++;
    history_log.children[challenge_time].children[1].textContent = a;
    history_log.children[challenge_time].children[2].textContent = b;
    history_log.children[challenge_time].children[3].textContent = c;
  }

  //開始ボタン
  start_button.addEventListener('click', () => {
    generate_numbers()
    game_reset()
    message_area.innerHTML = "3 ケタノ数字ヲ　入力シテクダサイ";
  });

  //回答ボタン
  input_button.addEventListener('click', () => {

    message_area.classList.remove("warn");
    let answer_nm = replace_narrow(answer.value);//全角数字を半角に変換

    if (/^\d{3}$/.test(answer_nm)) {

      let hit_count = hit_check(answer_nm);
      let blow_count = blow_check(answer_nm);

      blow_count = blow_count - hit_count;
      if (blow_count < 0) {
        blow_count = 0
      }

      enter_record(answer_nm,hit_count,blow_count);

      message_area.innerHTML = `ヒット数ハ ${hit_count}<br>ブロー数ハ ${blow_count}です`

      //判定結果
      if (hit_count == 3) {
        message_area.innerHTML = `オ見事デス<br>
          正解ハ ${truth_number} デシタ`
        input_area.classList.add("invisible");
        start_area.classList.remove("invisible")
        start_button.textContent = "モウ一度遊ブ";
      } else if (challenge_time === 10) {
        title.classList.add("warn");
        title.textContent = "GAME OVER";
        message_area.classList.add("warn");
        message_area.innerHTML = `ヒット数ハ ${hit_count}<br>ブロー数ハ ${blow_count} デス<br>残念　正解ハ ${truth_number} デシタ`
        input_area.classList.add("invisible");
        start_area.classList.remove("invisible");
        start_button.classList.add("restart");
        start_button.textContent = "再挑戦スル";
      } else if (challenge_time === 9) {
        console.log(challenge_time);
        message_area.innerHTML = `ヒット数ハ ${hit_count}<br>ブロー数ハ ${blow_count} デス<br>次ガ　最後ノ　回答デス`
      }

    } else {
      //３桁の数字でなかった場合
      message_area.classList.add("warn");
      message_area.innerHTML = "3 ケタノ数字ヲ　入力シテクダサイ";
    }
  });
}

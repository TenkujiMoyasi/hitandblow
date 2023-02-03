'use strict'
{
  const message_area = document.querySelector(".message_area");
  const start_area = document.querySelector(".start_area");
  const input_area = document.querySelector(".input_area");
  const answer = document.querySelector(".answer");
  const title = document.querySelector(".main_title");

  const history_log = document.querySelector(".history_log");
  let challenge_time = 0;

  const start_button = document.querySelector(".start_button");
  const input_button = document.querySelector(".input_button");

  let truth_100 = 0;
  let truth_10 = 0;
  let truth_1 = 0;
  let truth_number = 0;


  //全角数字を半角に変換
  function zen_to_han(str) {
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
    //
  
    // console.log(`答えは ${truth_number}`);
  }

  start_button.addEventListener('click', () => {
    generate_numbers()
    start_area.classList.add("invisible");
    start_button.classList.remove("restart");
    start_button.textContent = "スタート";
    input_area.classList.remove("invisible");
    message_area.classList.remove("warn");
    title.classList.remove("warn");
    title.textContent = "Hit & Blow";
    challenge_time = 0;

    for (let n = 1; n <= 10; n++) {
      // console.log("run")
      history_log.children[n].children[1].textContent = "";
      history_log.children[n].children[2].textContent = "";
      history_log.children[n].children[3].textContent = "";
      answer.value = "";
    }

    message_area.innerHTML = "3ケタの数字を　入力してください";
  });

  input_button.addEventListener('click', () => {

    message_area.classList.remove("warn");
    let answer_nm = zen_to_han(answer.value);//全角数字を半角に変換
    console.log(answer_nm);

    if (/^\d{3}$/.test(answer_nm)) {
      //３桁の数字だった場合
      // console.log("correct");
      let hit_count = 0;
      let blow_count = 0;

      let answer_100 = Math.floor(answer_nm / 100 % 10)
      let answer_10 = Math.floor(answer_nm / 10 % 10)
      let answer_1 = Math.floor(answer_nm / 1 % 10)

      // console.log(`1の位は ${answer_1}`);
      // console.log(`10の位は ${answer_10}`);
      // console.log(`100の位は ${answer_100}`);

      {
        {
          //ヒット数チェック
          if (truth_1 == answer_1) {
            // console.log("1の位ヒット");
            hit_count++;
          }
          if (truth_10 == answer_10) {
            // console.log("10の位ヒット");
            hit_count++;
          }
          if (truth_100 == answer_100) {
            // console.log("100の位ヒット");
            hit_count++;
          }
        }

        {
          //ブロー数チェック
          let t_numbers = [truth_100, truth_10, truth_1]
          console.log(t_numbers);

          if (t_numbers.indexOf(answer_1) !== -1) {
            blow_count++;
            // console.log("回答1の位ブロー");
          }
          if (t_numbers.indexOf(answer_10) !== -1) {
            // console.log("回答10の位ブロー");
            blow_count++;
          }
          if (t_numbers.indexOf(answer_100) !== -1) {
            // console.log("回答100の位ブロー");
            blow_count++;
          }
          blow_count = blow_count - hit_count;
          if (blow_count < 0) {
            blow_count = 0
          }
        }

        // console.log(`ヒット数は ${hit_count}`);
        // console.log(`ブロー数は ${blow_count}`);

        {
          challenge_time++;
          history_log.children[challenge_time].children[1].textContent = answer_nm;
          history_log.children[challenge_time].children[2].textContent = hit_count;
          history_log.children[challenge_time].children[3].textContent = blow_count;

          message_area.innerHTML = `ヒット数は ${hit_count}<br>ブロー数は ${blow_count}です`
        }
        if (hit_count == 3) {
          message_area.innerHTML = `お見事です<br>
          正解は ${truth_number} でした`
          input_area.classList.add("invisible");
          start_area.classList.remove("invisible")
          start_button.textContent = "もう一度遊ぶ";
        } else if (challenge_time === 10) {
          title.classList.add("warn");
          title.textContent = "GAME OVER";
          message_area.classList.add("warn");
          message_area.innerHTML = `ヒット数は ${hit_count}<br>ブロー数は ${blow_count}です<br>残念　正解は ${truth_number} でした`
          input_area.classList.add("invisible");
          start_area.classList.remove("invisible");
          start_button.classList.add("restart");
          start_button.textContent = "再挑戦する";
        } else if (challenge_time === 9) {
          console.log(challenge_time);
          message_area.innerHTML = `ヒット数は ${hit_count}<br>ブロー数は ${blow_count}です<br>次が　最後の　回答です`
        } else {
          // console.log(challenge_time);
        }
      }

    } else {
      //３桁の数字でなかった場合
      // console.log("wrong");

      message_area.classList.add("warn");
      message_area.innerHTML = "3ケタの数字を　入力してください";
    }
  });

    //ゲームスタート
    message_area.innerHTML = "ようこそ　挑戦者さま<br>0から9の　数字の中から<br>わたしが選んだ　３ケタの数字を<br>見事に　当ててみてください<br>回答できる　チャンスは　10回までです。"
    // console.log(message_area.textContent);
}

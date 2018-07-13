$(function() {
	$("#highperf").on(
			'click',
			function DisAndEnableHighPerf(e) {
				// checkboxの"click"イベント時のtrueとfalseが逆転してる？？？
				chk_status = $("#highperf").prop("checked");
				if (chk_status == true) {
					//alert("on")
					$("#highperf").prop("checked", true)
					// 1っか月以上の選択肢解放
					var rrt = $('#raw_retain_time').children();
					// 高性能使う時はローデータ保持期間が1488,4464,8760の値のdisabledを外して選択できるようにする
					for (var i = 0; i < rrt.length; i++) {
						if (rrt.eq(i).val() == 1488 || rrt.eq(i).val() == 4464
								|| rrt.eq(i).val() == 8760) {
							// alert(rrt.eq(i).val());
							rrt.eq(i).prop('disabled', false);
						}
					}

				} else if (chk_status == false) {
					//alert("of")
					$("#highperf").prop("checked", false)

					var rrt = $('#raw_retain_time').children();
					for (var i = 0; i < rrt.length; i++) {
						//構成の使わないときはローデータ保持期間が1488,4464,8760の値のdisabledをつけて選択できないようにする
						if (rrt.eq(i).val() == 1488 || rrt.eq(i).val() == 4464
								|| rrt.eq(i).val() == 8760) {
							// alert(rrt.eq(i).val());
							rrt.eq(i).prop('disabled', true);
						}
						// disabledに変更した値を選択している場合0を選択させる
						currentVal = $('#raw_retain_time').val()
						if (currentVal == 1488 || currentVal == 4464
								|| currentVal == 8760) {
							$('#raw_retain_time').val(0)

						}
					}
				}
			});
});

$(function() {
	$('form').on(
		'keydown keyup keypress change',
function Caluculater(){

	var interfaceNum = 0;
	var flowrate = 0;
	var isHighPerfEnabled = false;
	var rawRetainTime = 0;

	interfaceNum = $("#interface_number").val();
	flowrate = $("#flowlate").val();
	isHighPerfEnabled = $("#highperf").prop("checked");
	rawRetainTime = $('#raw_retain_time').val();


	//ローデータがなし以外の時、かつフローレートが0 のとき、フローレートの入力を必須にする。
	if(rawRetainTime != 0 && flowrate == 0){
		alert("ローデータを保持する時、フローレートの入力が必須です" )
	    $('#raw_retain_time').val(0)
	    $("#flowlate").focus();

		return false
	}

	requiredVol = CaluculateVolume(interfaceNum,flowrate,isHighPerfEnabled,rawRetainTime);
	Show(requiredVol);

			});
});


function CaluculateVolume(interfaceNum,flowrate,isHighPerfEnabled,rawRetainTime){
	var interfaceNumVol = 1;
	var minRequire = 400;
	var pgflowVol = 470
	var highPerfFlowVol = 50
	var totalInterfaceVal = 0;
	totalRawVal = 0;

	totalInterfaceVal = interfaceNum * interfaceNumVol;


	//計算始め

	if(isHighPerfEnabled){
		totalRawVal = ((flowrate * 60 * 60 * rawRetainTime) * highPerfFlowVol) ;
	}else{totalRawVal = ((flowrate * 60 * 60 * rawRetainTime )) * pgflowVol;
	}

	var GbTotalRawValtotalRawVal = totalRawVal / 1024 /1024 /1024
	requiredVol = totalInterfaceVal + GbTotalRawValtotalRawVal  + minRequire;
	return requiredVol;
}


function Show(requiredVol){
	$("#calc_result").text("想定容量は 「" + Math.ceil(requiredVol) + "GB」 です");
}

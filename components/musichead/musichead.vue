<template>
	<view class="music-head" :style="{color: color}">
		<view v-if="icon" class="music-head-icon" :class="{'music-head-iconBlack':iconblack}">
			<text @tap="handleToBack" class="iconfont iconzuojiantou-copy"></text>|
			<text @tap="handleToHome" class="iconfont iconshouye"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:["title","icon","color","iconblack"],
		methods: {
			handleToBack(){
				// 不写默认返回上一页
				uni.navigateBack();
			},
			handleToHome(){
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
		},
		
	}
</script>

<style scoped lang="scss">
// 设计稿要变成750 顶部用px   量出来的大小/2 ,其余的量出来后直接使用rpx
 .music-head{
	 width: 100%;
	 height:75px;
	 font-size: 16px;
	 line-height: 80px;
	 text-align: center;
	 color: black;
	 position: relative;
	 
	 .music-head-icon{
		 position: absolute;
		 left:8px;
		 top:26px;
		 width:90px;
		 height: 30px;
		 background:rgba(0,0,0,.4) ;
		 color: white;
		 line-height: 31px;
		 border-radius: 15px;
		 display: flex;
		 justify-content: space-evenly;
	 }
	 .music-head-iconBlack{ color:black; background:white; border:1px black solid;}
 }
</style>

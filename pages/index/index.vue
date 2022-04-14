<template>
	<view class="index" >
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @click="handleToSearch">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>

				<!-- <view class="index-list-wrap">
					<view class="index-list-item">
						<view class="index-list-img">
							<image src="../../static/wangyiyunyinyue.png" mode=""></image>
							<text>每天更新</text>
						</view>
				
						<view class="index-list-text">
							<view>1.与我无关 - 阿冗</view>
							<view>1.与我无关 - 阿冗</view>
							<view>1.与我无关 - 阿冗</view>
						</view>
					</view>
				</view> -->

				<view class="index-list-wrap">
		
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @click="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
				
						<view class="index-list-text">
							<view v-for="(musicItem,i) in item.tracks" :key="i">{{i+1}}.{{musicItem.first}} - {{musicItem.second}}</view>
						</view>
					</view>
				</view>


			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import { topList } from '../../common/request.js'
	export default {
		data() {
			return {
				topList:[],
			}
		},
		components: {
			musichead
		},
		onLoad() {
			topList('/toplist/detail').then(res=>{
				// console.log(res);
				this.topList = res.list.splice(0,4)
				console.log(this.topList);
			})
		},
		methods: {
			handleToList(id){
				uni.navigateTo({
					url: `/pages/list/list?id=${id}`
				});
			},
			handleToSearch(){
				uni.navigateTo({
					url: `/pages/search/search`
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	// 设计稿750 量出来 直接写rpx
	.index {
		.index-search {
			display: flex;
			align-items: center;
			height: 74rpx;
			margin: 70rpx 30rpx 30rpx 30rpx;
			background: #f7f7f7;
			border-radius: 50rpx;

			text {
				margin: 0 27rpx;
			}

			input {
				font-size: 26rpx;
				flex: 1;
			}
		}
	}

	.index-list-wrap {
		margin: 0 30rpx;

		.index-list-item {
			display: flex;
			margin-bottom: 34rpx;

			.index-list-img {
				width: 212rpx;
				height: 212rpx;
				position: relative;
				border-radius: 30rpx;
				overflow: hidden;
				margin-right: 22rpx;

				image {
					height: 100%;
					width: 100%;
				}

				text {
					position: absolute;
					left: 12rpx;
					bottom: 16rpx;
					color: white;
					font-size: 20rpx;
				}
			}
		}

		.index-list-text {
			font-size: 24rpx;
			line-height: 70rpx;
			view{
				width: 460rpx;
				/*多出来的省略号显示*/
				text-overflow:ellipsis;
				/*不换行*/
				white-space: nowrap;
				/*超出范围隐藏*/
				overflow: hidden;
			}
		}
	}
</style>

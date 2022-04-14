<template>
	<view class="list">
		<view class="fixbg" :style="{'backgroundImage':`url(${playlist.coverImgUrl})`}"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container" v-if="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont iconyousanjiao">{{playCount}}</text>
					</view>
					<view class="list-head-text">
						<view>{{playlist.name}}</view>
						<view>
							<image :src="playlist.creator.avatarUrl" mode=""></image>
							<text>{{playlist.creator.nickname}}</text>
						</view>
						<view>
							{{playlist.description}}
						</view>
					</view>
				</view>
				<!-- 分享功能微信需要单独设置 -->
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="list-share">
					<text class="iconfont iconicon-"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-title">
						<text class="iconfont iconbofang1"></text>
						<text>播放全部</text>
						<text>(共{{playlist.trackCount}}首)</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="index" @click="handleTodetail(item.id)">
						<view class="list-music-top">{{index+1}}</view>
						<view class="list-music-song">
							<view class="v1">{{item.name}}</view>
							<view class="v2">
								<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70"
									src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].playMaxbr == 999000" src="../../static/sq.png"></image>
								<text>{{item.ar[0].name}} - {{item.name}}</text>
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import { rankingList } from '../../common/request.js'
	export default {
		data() {
			return {
				playlist: {
					coverImgUrl:'',
					playCount: '',
					name: '',
					creator: {
						avatarUrl: '',
						nickname:''
					},
					description: '',
					trackCount: '',
					tracks: []
				},
				// 独家 SQ
				privileges: [],
				isLoading:true,
			};
		},
		components: {
			musichead
		},
		onLoad(options) {
			// 开启加载效果
			uni.showLoading({
				title: '正在加载中...',
				mask: true
			});
			console.log(options.id);
			rankingList(options.id).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.playlist = res.playlist
					this.privileges = res.privileges
					// 把当前歌单中的所有ID 赋值到vuex好切换上下首
					this.$store.commit('INIT_TOPLISTIDS',res.playlist.trackIds)
					this.isLoading = false;
				}
				uni.hideLoading();
			})
		},
		computed: {
			playCount() {
				let num =  this.playlist.playCount;
				// 如果大于1万小于1亿的除10000返回
				if(num>=10000 && num<100000000){
					num = num / 10000
					// 四舍五入 保留一位小数
					return num.toFixed(1) + '万';
				}else if(num>100000000){
					num = num / 100000000;
					return num.toFixed(1) + '亿'
				}else{
					return num
				}
			}
		},
		methods: {
			handleTodetail(songId) {
				uni.navigateTo({
					url:`/pages/detail/detail?songId=${songId}`
				})
			}
		},
	}
</script>

<style lang="scss">
	.list-head {
		display: flex;
		margin: 30rpx;

		.list-head-img {
			width: 265rpx;
			height: 265rpx;
			border-radius: 15rpx;
			margin-right: 40rpx;
			overflow: hidden;
			position: relative;

			image {
				width: 100%;
				height: 100%;
			}

			text {
				position: absolute;
				font-size: 26rpx;
				color: white;
				right: 8rpx;
				top: 8rpx;
			}
		}

		.list-head-text {
			flex: 1;
			font-size: 24rpx;
			color: #c3d1e3;

			image {
				width: 52rpx;
				height: 52rpx;
				border-radius: 50%;
			}

			view:nth-child(1) {
				font-size: 34rpx;
				color: #ffffff;
			}

			view:nth-child(2) {
				display: flex;
				align-items: center;
				margin: 30rpx 0;
			}

			view:nth-child(2) text {
				margin-left: 15rpx;
			}

			view:nth-child(3) {
				line-height: 38rpx;
			}
		}
	}

	.list-share {
		width: 330rpx;
		height: 72rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		color: white;
		border-radius: 36rpx;

		text {
			margin-right: 15rpx;
		}
	}

	.list-music {
		background: white;
		border-radius: 50rpx;
		overflow: hidden;
		margin-top: 45rpx;

		.list-music-title {
			height: 58rpx;
			line-height: 58rpx;
			margin: 30rpx 30rpx 70rpx 30rpx;

			text:nth-child(1) {
				font-size: 58rpx;
			}

			text:nth-child(2) {
				font-size: 34rpx;
				margin: 0 10rpx 0 25rpx;
			}

			text:nth-child(3) {
				font-size: 28rpx;
				color: #b2b2b2;
			}
		}

		.list-music-item {
			display: flex;
			margin: 0 30rpx 70rpx 44rpx;
			align-items: center;

			.list-music-top {
				width: 56rpx;
				font-size: 28rpx;
				color: #979797;
			}

			.list-music-song {
				flex: 1;
				line-height: 40rpx;

				.v1 {
					font-size: 30rpx;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.v2 {
					font-size: 22rpx;
					color: #a2a2a2;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					text {
						font-size: 22rpx;
					}
				}

				image {
					width: 34rpx;
					height: 22rpx;
					margin-right: 10rpx;
				}
			}

			text {
				font-size: 50rpx;
				color: #c8c8c8;
			}
		}
	}
</style>

<template>
	<view>
		<view class="fixbg" :style="{backgroundImage:'url('+ songDetail.al.picUrl +')'}"></view>
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="container" v-if="!isLoading">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run':isplayrotate}"></image>
					<!-- 动态切换图标 -->
					<text class="iconfont" :class="iconPlay"></text>
					<view></view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap"
						:style="{ transform : 'translateY(' +  - (lyricIndex - 1) * 82  + 'rpx)' }">
						<view class="detail-lyric-item" :class="{active:lyricIndex == index}"
							v-for="(item,index) in songLyric" :key="index">
							{{item.lyric}}
						</view>
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-list">
						<view @click="handleToSimi(item.id)" class="detail-like-item" v-for="(item,index) in songSimi"
							:key="item.id">
							<view class="detail-like-img">
								<image :src="item.album.picUrl" mode=""></image>
							</view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag>60&&item.privilege.flag<70"
										src="../../static/dujia.png" mode=""></image>
									<image v-if="item.privilege.maxbar==999000" src="../../static/sq.png" mode="">
									</image>
									{{item.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>

					</view>
				</view>

				<view class="detail-comment">
					<view class="detail-comment-title">精彩评论</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-head">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view>{{formatTime(item.time)}}</view>
								</view>
								<view class="detail-comment-like">
									{{playCount(item.likedCount)}} <text class="iconfont iconlike"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{item.content}}
							</view>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import { songDetail, songComment, songLyric, songSimi, songUrl } from '../../common/request.js'
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				// 控制歌词高亮显示的字段
				lyricIndex: 0,
				// 控制图标
				iconPlay: 'iconpause',
				// 控制是否旋转
				isplayrotate: true,
				isLoading: true,

			};
		},
		components: {
			musichead
		},
		onLoad({ songId }) {
			// 显示加载效果
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			this.init(songId);

		},
		onUnload() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide() {
			this.cancelLyricIndex();
			// #ifdef H5
			// 需要销毁
			this.bgAudioManager.destroy();
			// #endif
		},
		methods: {
			init(songId) {
				this.isLoading = true;
				// 把当前的ID传给vuex
				this.$store.commit('NEXT_ID',songId)
				// 歌曲详情
				songDetail(songId).then(res => {
					// console.log(res);
					if (res.code == 200) {
						this.songDetail = res.songs[0];
					}
				})
				songSimi(songId).then(res => {
					// console.log(res);
					if (res.code == 200) {
						this.songSimi = res.songs;
					}
				})
				songComment(songId).then(res => {
					// console.log(res);
					this.songComment = res.hotComments;

				})
				songLyric(songId).then(res => {
					// console.log(res);
					let lyric = res.lrc.lyric;
					let re = /\[([^\]]+)\]([^[]+)/g;
					let result = [];
					lyric.replace(re, ($0, $1, $2) => {
						result.push({ time: this.formatTimeToSec($1), lyric: $2 });
					})
					this.songLyric = result;
					console.log(result);
				})

				songUrl(songId).then(res => {
					// console.log(res);

					// 音频使用uni提供的 uni.getBackgroundAudioManager() 这个返回后台后也能继续播放
					// 注意 因为背景音频播放耗费手机电量，所以平台都有管控，需在manifest中填写申请。
					// 小程序平台，需在manifest.json 对应的小程序节点下，填写"requiredBackgroundModes": ["audio"]。发布小程序时平台会审核

					// #ifdef MP-WEIXIN
					this.bgAudioManager = uni.getBackgroundAudioManager();
					this.bgAudioManager.title = this.songDetail.name;
					// #endif

					// #ifdef H5
					// H5 进来是不支持自动播放的只能手动播放
					// 进来需要判断下是否存在，不然会重复创建  并且退出的时候还要销毁
					if (!this.bgAudioManager) {
						this.bgAudioManager = uni.createInnerAudioContext()
					}
					this.iconPlay = 'iconbofang1';
					this.isplayrotate = false;
					// #endif

					this.bgAudioManager.src = res.data[0].url || '';
					// 刚进来的时候也要调用一次 防止出现bug
					this.listenLyricIndex();
					// 开始播放
					this.bgAudioManager.onPlay(() => {
						console.log(123);
						// 更改图标
						this.iconPlay = 'iconpause'
						this.isplayrotate = true;
						// 开始播放的时候调用歌词滚动
						this.listenLyricIndex();
					})
					// 暂停
					this.bgAudioManager.onPause(() => {
						// 更改图标
						this.iconPlay = 'iconbofang1'
						this.isplayrotate = false;
						// 清除
						this.cancelLyricIndex();
					})
					// 当播放结束后自然切换下一首
					this.bgAudioManager.onEnded(()=>{
						this.init(this.$store.state.nextId)
					})
					this.isLoading = false;
					uni.hideLoading();
				})
				
			},
			// 点赞
			playCount(num) {
				// 如果大于1万小于1亿的除10000返回
				if (num >= 10000 && num < 100000000) {
					num = num / 10000
					// 四舍五入 保留一位小数
					return num.toFixed(1) + '万';
				} else if (num > 100000000) {
					num = num / 100000000;
					return num.toFixed(1) + '亿'
				} else {
					return num
				}
			},
			// 日期
			formatTime(time) {
				var date = new Date(time)
				return `${date.getFullYear()}年${(date.getMonth()+1)}月${date.getDate()}日`
			},
			// 歌词时间过滤
			formatTimeToSec(time) {
				var arr = time.split(':');
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
			},

			// 控制播放
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					console.log(123);
					// 播放  这里会触发上面 this.bgAudioManager的播放暂停监听
					this.bgAudioManager.play();
				} else {
					console.log(321);
					this.bgAudioManager.pause();
				}
			},
			// 歌词播放滚动效果
			listenLyricIndex() {
				// 每次进来都清除一下定时器
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					// 遍历歌词
					for (var i = 0; i < this.songLyric.length; i++) {
						// 如果是最后一段歌词的判断逻辑  如果当前时间大于数组中最后一位的时间
						if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							// 数组长度-1赋值给高亮显示
							this.lyricIndex = ithis.songLyric.length - 1;
							return
						}
						// 当前播放的时间 大于 数组中的时间 并且 当前播放的时间小于后一位数组的时间
						// 把i赋值给lyricIndex 让其高亮
						if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager
							.currentTime < this.songLyric[i + 1].time) {
							this.lyricIndex = i
						}

					}
				}, 300)
			},
			// 清除定时器
			cancelLyricIndex() {
				clearInterval(this.timer)
			},
			// 类似的歌点击后刷新页面数据
			handleToSimi(songId) {
				this.init(songId)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 210rpx auto 44rpx auto;
		position: relative;

		image {
			width: 380rpx;
			height: 380rpx;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			animation: 10s linear infinite move;
			animation-play-state: paused;
		}

		.detail-play-run {
			animation-play-state: running;
		}

		@keyframes move {
			from {
				transform: rotate(0deg);
			}

			to {
				transform: rotate(360deg);
			}
		}

		text {
			width: 100rpx;
			height: 100rpx;
			font-size: 100rpx;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			color: white;
		}

		view {
			position: absolute;
			width: 170rpx;
			height: 266rpx;
			position: absolute;
			left: 60rpx;
			right: 0;
			margin: auto;
			top: -170rpx;
			background: url(~@/static/needle.png);
			background-size: cover;
		}
	}

	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #919193;

		.detail-lyric-wrap {
			// 控制动画速率
			transition: .5s;

			.active {
				color: white
			}
		}

		.detail-lyric-item {
			height: 82rpx;
			margin: 0 32rpx;
			text-overflow: ellipsis;
			/*不换行*/
			white-space: nowrap;
			/*超出范围隐藏*/
			overflow: hidden;
		}

	}


	.detail-like {
		margin: 0 32rpx;
	}

	.detail-like-title {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-like-list {}

	.detail-like-item {
		display: flex;
		margin-bottom: 38rpx;
		align-items: center;
	}

	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 15rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-like-img image {
		width: 100%;
		height: 100%;
	}

	.detail-like-song {
		flex: 1;
	}

	.detail-like-song view:nth-child(1) {
		color: white;
		font-size: 30rpx;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 10rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
		color: #a2a2a2;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.detail-like-song image {
		width: 34rpx;
		height: 22rpx;
		margin-right: 10rpx;
	}

	.detail-like-item text {
		font-size: 50rpx;
		color: #877764;
	}


	.detail-comment {
		margin: 0 32rpx;
	}

	.detail-comment-title {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		display: flex;
		margin-bottom: 28rpx;
	}

	.detail-comment-img {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%
	}

	.detail-comment-content {
		flex: 1;
		color: #cac9cd;
	}

	.detail-comment-head {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name view:nth-child(1) {
		font-size: 24rpx;
	}

	.detail-comment-name view:nth-child(2) {
		font-size: 20rpx;
	}

	.detail-comment-like {
		font-size: 30rpx;
	}

	.detail-comment-text {
		line-height: 40rpx;
		color: white;
		font-size: 28rpx;
		margin-top: 16rpx;
		border-bottom: 1px #595860 solid;
		padding-bottom: 40rpx;
	}
</style>

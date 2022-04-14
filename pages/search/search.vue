<template>
	<view>
		<musichead title="搜索" :icon="true" :iconblack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="搜索歌曲" @input="handleToSuggest"
					 v-model="searchWord" @confirm="handleToSearch(searchWord)" />
					<text v-show="searchWord.length>=1" class="iconfont iconguanbi" @click="handleToClose"></text>
				</view>
				<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont iconlajitong" @click="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<!-- 当点击历史搜索的时候 自动赋值到搜索框 -->
							<view v-for="(item,index) in searchHistory" :key="index" @click="handleToWord(item)">
								{{item}}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" @click="handleToWord(item.searchWord)"
							v-for="(item,index) in searchHot" :key="index">
							<view class="search-hot-top" :style="index>=3?'color:black':''">{{index+1}}</view>
							<view class="search-hot-word">
								<view>{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFill"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<text class="search-hot-count">{{item.score}}</text>

						</view>
					</view>
				</block>
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" @click="handleToDetail(item.id)"
							v-for="(item,index) in searchList" :key="index">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>
									{{item.artists[0].name}} - {{item.album.name}}
								</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>

					</view>
				</block>
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">
							搜索“{{searchWord}}”
						</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest"
						 :key="index" @click="handleToWord(item.keyword)">
							<text class="iconfont iconsearch"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import { searchHot, searchSuggest, searchWord } from '../../common/request.js'
	export default {
		data() {
			return {
				searchHot: [],
				// 点击热搜榜获取热搜词填到搜索框
				searchWord: '',
				// 搜索历史存储
				searchHistory: [],
				searchType: 1,
				searchList: [],
				// 搜索建议
				searchSuggest:[],
			};
		},
		components: {
			musichead
		},
		onLoad() {
			searchHot().then(res => {
				console.log(res);
				if (res.code == 200) {
					this.searchHot = res.data
				}
			});
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
		},
		methods: {
			// 点击字段的时候把点击的值赋值给searchWord
			handleToWord(word) {
				this.searchWord = word
				// console.log(word);
				// 然后执行搜索
				this.handleToSearch(word)
			},
			// 按下回车键
			handleToSearch(value) {
				if(!value) return 
				this.searchHistory.unshift(value)
				// 去重
				this.searchHistory = [...new Set(this.searchHistory)]
				// 如果长度大于10 把长度控制在10
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10;
				}
				// 本地存储历史搜索
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				// 搜索的时候调用
				this.getSearchList(value);
			},
			// 清除搜索记录
			handleToClear() {
				// 清空本地存储
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				})
			},
			// 搜索的时候调用
			getSearchList(value) {
				// 拿到搜索关键词，发送请求
				searchWord(value).then(res => {
					console.log(res);
					if (res.code == 200) {
						this.searchList = res.result.songs
						// 切换场景
						this.searchType = 2;
					}
				})
			},
			// 点击取消按钮
			handleToClose() {
				this.searchWord = '';
				this.searchType = 1;
			},
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId
				});
			},
			// 正在输入时执行
			handleToSuggest(ev){
				// 获取当前输入的值
				let value = ev.detail.value;
				// 如果为空的时候执行
				if(!value){
					// 切回场景 1
					this.searchType = 1;
					// 直接返回出去
					return
				}
				// 发送请求获取模糊搜索数据
				searchSuggest(value).then(res=>{
					console.log(res);
					if(res.code == 200){
						this.searchSuggest = res.result.allMatch;
						// 切换场景
						this.searchType = 3;
					}
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.search-search {
		display: flex;
		background: #f7f7f7;
		height: 73rpx;
		margin: 28rpx 30rpx 30rpx 30rpx;
		border-radius: 50rpx;
		align-items: center;

		text {
			margin: 0 27rpx;
		}

		input {
			font-size: 26rpx;
			flex: 1;
		}
	}

	.search-history {
		margin: 0 30rpx;
		font-size: 26rpx;

		.search-history-head {
			display: flex;
			justify-content: space-between;
		}

		.search-history-list {
			display: flex;
			margin-top: 36rpx;
			flex-wrap: wrap;

			view {
				padding: 20rpx 40rpx;
				background: #f7f7f7;
				border-radius: 50rpx;
				margin-right: 30rpx;
				margin-bottom: 20rpx;
			}
		}
	}

	.search-hot {
		margin: 30rpx 30rpx;
		font-size: 26rpx;
		color: #bebebe;

		.search-hot-item {
			display: flex;
			align-items: center;
			margin-top: 40rpx;
		}

		.search-hot-top {
			width: 60rpx;
			color: #fb2221;
			font-size: 34rpx;
		}

		.search-hot-word {
			flex: 1;

			view:nth-child(1) {
				font-size: 36rpx;
				color: black;
			}

			image {
				width: 48rpx;
				height: 22rpx;
			}
		}
	}

	.search-result {
		border-top: 2rpx #e5e5e5 solid;
		padding: 30rpx;

		.search-result-item {
			display: flex;
			align-items: center;
			border-bottom: 2rpx #e5e5e5 solid;
			padding-bottom: 30rpx;
			margin-bottom: 30rpx;

			text {
				font-size: 50rpx;
			}

			.search-result-word {
				flex: 1;

				view:nth-child(1) {
					font-size: 28rpx;
					color: #3e6694;
				}

				view:nth-child(2) {
					font-size: 26rpx;
				}
			}
		}
	}

	.search-suggest {
		border-top: 2rpx #e5e5e5 solid;
		padding: 30rpx;
		font-size: 26rpx;

		.search-suggest-head {
			color: #537caa;
			margin-bottom: 40rpx;
		}

		.search-suggest-item {
			color: #666666;
			margin-bottom: 70rpx;

			text {
				color: #c2c2c2;
				font-size: 26rpx;
				margin-right: 26rpx;
			}
		}
	}
</style>

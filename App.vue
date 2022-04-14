<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {

		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	.container{
		width: 100%;
		// 把顶部 算进去
		height: calc(100vh - 75px);
		overflow: hidden;
		scroll-view{
			height: 100%;	
		}
	}
	.fixbg{
		width: 100%;
		height: 100vh;
		position:fixed;
		left:0;
		top:0;
		background-image: url(static/wangyiyunyinyue.png);
		background-size: cover;
		background-position: center 0;
		// CSS3 filter(滤镜) 属性
		filter: blur(20px) grayscale(70%);
		// 缩放
		transform: scale(1.2);
	}
</style>

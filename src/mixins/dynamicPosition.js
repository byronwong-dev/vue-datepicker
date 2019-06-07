import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { computePositionFromParent } from '@/utils';

const dynamicPosition = {
  data: () => ({
    offset: 28,
    left: 0,
    top: 0,
    origin: 'top center',
  }),
  computed: {
    styles () {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`,
        transformOrigin: this.origin,
      };
    },
  },
  mounted () {
    if (this.inline) return;
    // We're using a `requestAnimationFrame()`
    // for optimal performance.
    const eventHandler = () => requestAnimationFrame(this.updatePosition);
    window.addEventListener('resize', eventHandler);

    this.$on('hook:destroyed', () => {
      window.removeEventListener('resize', eventHandler);
      clearAllBodyScrollLocks();
    });
  },
  methods: {
    updatePosition () {
      if (window.innerWidth < 480 && this.fullscreenMobile && this.isVisible) {
        disableBodyScroll(this.$el);
      } else {
        enableBodyScroll(this.$el);
      }

      const { top, left, origin } = computePositionFromParent(
        this.$el,
        this.$el.parentElement,
        this.offset
      );
      this.top = top;
      this.left = left;
      this.origin = origin;
    },
  },
};

export default dynamicPosition;
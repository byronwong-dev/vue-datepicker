import dayjs from 'dayjs';
import { shallowMount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker.vue';

import { DEFAULT_INPUT_DATE_FORMAT, DEFAULT_HEADER_DATE_FORMAT } from '@/constants';

describe('DatePicker', () => {
  let mountComponent;
  const dummyDate = new Date([2019, 5, 16]);

  beforeEach(() => {
    mountComponent = ({
      date = dummyDate,
      disabled = false,
      format,
      type = 'date',
    } = {}) =>
      shallowMount(DatePicker, {
        propsData: {
          value: date,
          disabled,
          format,
          type,
        },
      });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('Should init data', () => {
    const wrapper = mountComponent();
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.vm.date).toEqual(dayjs(dummyDate));
    expect(wrapper.vm.isVisible).toEqual(false);
  });

  describe('computed', () => {
    describe('inputFormat', () => {
      it.each([
        [undefined, DEFAULT_INPUT_DATE_FORMAT.date],
        ['YYYY-MM-DD', 'YYYY-MM-DD'],
      ])('when format equal %p, should return %p', (format, expectedResult) => {
        const wrapper = mountComponent({ format });
        expect(wrapper.vm.inputFormat).toEqual(expectedResult);
      });
    });

    describe('headerFormat', () => {
      it.each([
        [undefined, DEFAULT_HEADER_DATE_FORMAT.date],
        ['MMMM MM', 'MMMM MM'],
      ])('when format equal %p, should return %p', (format, expectedResult) => {
        const wrapper = mountComponent({ format });
        expect(wrapper.vm.headerFormat).toEqual(expectedResult);
      });
    });
  });

  describe('beforeDestroy', () => {
    it('should emit destroy event', () => {
      const wrapper = mountComponent();
      wrapper.destroy();
      expect(wrapper.emitted().onDestroy).toBeTruthy();
    });
  });

  describe('methods', () => {
    describe('toggleDatepicker', () => {
      it('should not show datepicker if disabled', () => {
        const wrapper = mountComponent({ disabled: true });
        expect(wrapper.vm.isVisible).toEqual(false);

        wrapper.vm.toggleDatepicker();
        expect(wrapper.vm.isVisible).toEqual(false);
      });

      it('should set isVisible to true', () => {
        const wrapper = mountComponent();
        expect(wrapper.vm.isVisible).toEqual(false);

        wrapper.vm.toggleDatepicker();
        expect(wrapper.vm.isVisible).toEqual(true);
      });

      it('should set isVisible to false iff already open', () => {
        const wrapper = mountComponent();
        wrapper.setData({ isVisible: true });

        wrapper.vm.toggleDatepicker();
        expect(wrapper.vm.isVisible).toEqual(false);
      });
    });

    describe('showDatePicker', () => {
      it('should set isVisible to true', () => {
        const wrapper = mountComponent();
        wrapper.setData({ isVisible: false });

        wrapper.vm.showDatePicker();
        expect(wrapper.vm.isVisible).toEqual(true);
        expect(wrapper.emitted().onOpen).toBeTruthy();
      });

      it('should do nothing if disabled', () => {
        const wrapper = mountComponent({ disabled: true });
        wrapper.setData({ isVisible: false });

        wrapper.vm.showDatePicker();
        expect(wrapper.vm.isVisible).toEqual(false);
        expect(wrapper.emitted().onOpen).toBeFalsy();
      });
    });

    describe('hideDatePicker', () => {
      it('should set isVisible to false', () => {
        const wrapper = mountComponent();
        wrapper.setData({ isVisible: true });

        wrapper.vm.hideDatePicker();
        expect(wrapper.vm.isVisible).toEqual(false);
        expect(wrapper.emitted().onClose).toBeTruthy();
      });

      it('should do nothing if datepicker isn\'t opened', () => {
        const wrapper = mountComponent();
        wrapper.setData({ isVisible: false });

        wrapper.vm.hideDatePicker();
        expect(wrapper.vm.isVisible).toEqual(false);
        expect(wrapper.emitted().onClose).toBeFalsy();
      });
    });

    describe('changeDate', () => {
      it('should update date', () => {
        const wrapper = mountComponent();
        wrapper.vm.changeDate(dayjs(new Date([2019, 5, 18])));
        expect(wrapper.vm.date.format('YYYY-MM-DD')).toEqual('2019-05-18');
        expect(wrapper.emitted().input[0]).toEqual(['2019-05-18']);
        expect(wrapper.emitted().onChange).toBeTruthy();
      });
    });
  });
});

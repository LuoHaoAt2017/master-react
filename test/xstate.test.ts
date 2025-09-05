import { describe, expect, test } from 'vitest';
import { createMachine, interpret, assign, send } from 'xstate';
import dayjs from 'dayjs';
import type { Dayjs } from "dayjs";

describe('人机对话状态机测试', function () {

  test('瞬时状态转换: 判断当前是上午，下午，夜晚', () => {
    const dayOfTimeMachine = createMachine<{
      time: Dayjs
    }>(
      {
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgFd8BrfAewHd8BiAbQAYBdRUABxtlwAuuGvi4gAHogCMANgCcJWVIAsMgMwB2AExa5y5QA41AGhABPacqkkDcjazkBWZWuWtVGgwF8vptFjxCUgpqeiZmKU4kEF5+IRExSQRZBSVVTR09QxNzRC1WVhI1AxkZRy0NKRLHKTkfPwwcAmJyKloGFi0onj5BYVFopJTFGRV1bV19I1MLBCMSNw1HYpUs2UcfXxBaCDgxfyagsVi+hMHEAFoZGcuZepADwJaQ9oGeuP7ExGUtG4Q5Qp6cp6NTrVgGKz3R7NUioGgAJ3wBCgx168TeEkQahkhVY2jkWhqjhk9hKfykagUBikWmUGhkBjxrFceKhjSepHQADMBGBETQzu9ThiktjcfjCVJiaTrrlknIDEVWPkWXJZJStGo2QEYSQwAA3MBI-Ao6IndFfBBikh43SS6Xg2WzalFTK1cq0rS2bybIA */
        initial: 'unknown',
        states: {
          unknown: { // 瞬时状态是一种特殊的状态，它不会停留在unknown状态，而是立即转移到下一个状态(morning/afternoon/evening)。
            always: [
              {
                target: 'morning',
                cond: 'isBeforeNoon',
              },
              {
                target: 'afternoon',
                cond: 'isBeforeSix',
              },
              {
                target: 'evening',
              },
            ],
          },
          morning: {},
          afternoon: {},
          evening: {},
        },
      },
      {
        guards: {
          isBeforeNoon(ctx) {
            const time = dayjs().startOf('d').add(12, 'h');
            return dayjs(ctx.time).isBefore(time);
          },
          isBeforeSix(ctx) {
            const time = dayjs().startOf('d').add(18, 'h');
            return dayjs(ctx.time).isBefore(time);
          },
        },
      },
    );
    interpret(
      dayOfTimeMachine.withContext({
        time: dayjs().hour(15),
      }),
    )
      .onTransition(function (state) {
        console.log(state.value);
        expect(state.value).toEqual("afternoon");
      })
      .start();
  });

  test('瞬时状态转换：判断水桶是否已经满了。', () => {
    // 用于条件判断或逻辑处理，而不需要用户干预。
    // 当某个状态需要立即转移到另一个状态时。
    const bucketMachine = createMachine({
      initial: 'empty',
      context: {
        capacity: 10,
        volume: 0,
      },
      states: {
        empty: {
          always: [
            {
              target: 'full',
              cond: (ctx) => ctx.volume >= ctx.capacity
            }
          ],
          on: {
            add: {
              actions: ['addWater']
            }
          },
          activities: ['addLoop']
        },
        full: {
          entry: () => {
            console.log("水满则溢");
          }
        }
      }
    }, {
      actions: {
        addWater(ctx, evt) {
          return assign({
            volume: ctx.volume + evt.data
          })
        }
      },
      activities: {
        addLoop() {
          const interval = setInterval(() => send({
            type: 'add',
            data: 5
          }), 1000);
          return () => clearInterval(interval);
        }
      }
    });

    interpret(bucketMachine).onTransition((state) => {
      console.log(state.value);
      expect(state.value).toEqual("empty");
      setTimeout(() => {
        expect(state.value).toEqual("full");
      }, 3000);
    }).start();
  });
});
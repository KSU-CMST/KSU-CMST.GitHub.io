/*    
 * LeapJS-Plugins  - v0.1.4 - 2014-04-07    
 * http://github.com/leapmotion/leapjs-plugins/    
 *    
 * Copyright 2014 LeapMotion, Inc    
 *    
 * Licensed under the Apache License, Version 2.0 (the "License");    
 * you may not use this file except in compliance with the License.    
 * You may obtain a copy of the License at    
 *    
 *     http://www.apache.org/licenses/LICENSE-2.0    
 *    
 * Unless required by applicable law or agreed to in writing, software    
 * distributed under the License is distributed on an "AS IS" BASIS,    
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    
 * See the License for the specific language governing permissions and    
 * limitations under the License.    
 *    
 */    

//CoffeeScript generated from main/hand-entry/leap.hand-entry.coffee
/*
Emits controller events when a hand enters of leaves the frame
"handLost" and "handFound"
Each event also includes the hand object, which will be invalid for the handLost event.
*/


(function() {
    var handEntry;
  
    handEntry = function() {
      var activeHandIds;
      activeHandIds = [];
      this.on("deviceDisconnected", function() {
        for (var i = 0, len = activeHandIds.length; i < len; i++){
        id = activeHandIds[i];
        activeHandIds.splice(i, 1);
        // this gets executed before the current frame is added to the history.
        this.emit('handLost', this.lastConnectionFrame.hand(id))
        i--;
        len--;
      };
      });
      return {
        frame: function(frame) {
          var id, newValidHandIds, _i, _len, _results;
          newValidHandIds = frame.hands.map(function(hand) {
            return hand.id;
          });
          for (var i = 0, len = activeHandIds.length; i < len; i++){
          id = activeHandIds[i];
          if(  newValidHandIds.indexOf(id) == -1){
            activeHandIds.splice(i, 1);
            // this gets executed before the current frame is added to the history.
            this.emit('handLost', this.frame(1).hand(id))
            i--;
            len--;
          }
        };
          _results = [];
          for (_i = 0, _len = newValidHandIds.length; _i < _len; _i++) {
            id = newValidHandIds[_i];
            if (activeHandIds.indexOf(id) === -1) {
              activeHandIds.push(id);
              _results.push(this.emit('handFound', frame.hand(id)));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };
    };
  
    if ((typeof Leap !== 'undefined') && Leap.Controller) {
      Leap.Controller.plugin('handEntry', handEntry);
    } else if (typeof module !== 'undefined') {
      module.exports.handEntry = handEntry;
    } else {
      throw 'leap.js not included';
    }
  
  }).call(this);
  
  //CoffeeScript generated from main/hand-hold/leap.hand-hold.coffee
  (function() {
    var handHold;
  
    handHold = function() {
      var extraHandData;
      extraHandData = {};
      return {
        hand: {
          data: function(hashOrKey, value) {
            var key, _name, _results;
            extraHandData[_name = this.id] || (extraHandData[_name] = []);
            if (value) {
              return extraHandData[this.id][hashOrKey] = value;
            } else if (toString.call(hashOrKey) === '[object String]') {
              return extraHandData[this.id][hashOrKey];
            } else {
              _results = [];
              for (key in hashOrKey) {
                value = hashOrKey[key];
                if (value === void 0) {
                  _results.push(delete extraHandData[this.id][key]);
                } else {
                  _results.push(extraHandData[this.id][key] = value);
                }
              }
              return _results;
            }
          },
          hold: function(object) {
            if (object) {
              return this.data({
                holding: object
              });
            } else {
              return this.hold(this.hovering());
            }
          },
          holding: function() {
            return this.data('holding');
          },
          release: function() {
            var release;
            release = this.data('holding');
            this.data({
              holding: void 0
            });
            return release;
          },
          hoverFn: function(getHover) {
            return this.data({
              getHover: getHover
            });
          },
          hovering: function() {
            var getHover;
            if (getHover = this.data('getHover')) {
              return this._hovering || (this._hovering = getHover.call(this));
            }
          }
        }
      };
    };
  
    if ((typeof Leap !== 'undefined') && Leap.Controller) {
      Leap.Controller.plugin('handHold', handHold);
    } else if (typeof module !== 'undefined') {
      module.exports.handHold = handHold;
    } else {
      throw 'leap.js not included';
    }
  
  }).call(this);
  
  
  
  
  (function () {
    var CONNECT_LEAP_ICON = '<a href="#" onclick="this.style.display = \'none\'; return false;"><img id="connect-leap" class="playback-connect-leap" style="margin: 0px 2px -2px 0px;" src="data:image/gif;base64,R0lGODlh9AHmAPf/AOnxtbS0tc3eVTMzNM3NztvnhtbX1/Hy86ioqezs7Z6entzd3r7UJdHhZcnKzOjo6sXZO319fkJCQurq6xMTFPj65q2treHh4vT42uXl5/Lz9JCQkfP09FxcXebm54yMjsvMzSgoKdfleLGxsUtLTPDx8cHCwlNTVSIiI6CgoYSEhAUFBpmZmtHS1Li5ucHDxNHR0err7HZ2duDrl8XFxvP09vv98/Dx8trb3MjIyN7e3x4eHmZmZj4+PrzTHtDQ0uvs7dra2uzt7ZWVldfY2cPExtbX2AsLDImJiff4+MbHysjIyoCBgsXGyHp6er6+vsDVKm5ucOTk5XFxc83O0MbGx2FhYm1tbsDWLKWlpu70xRkZGkVFRtPU1pydoM/Q0bKztKamqCQkJeLi5O/w8Glpab/AwtjY2f7+/WtrbcfIytjZ26qrrDc4OdHS0nBxc7/VJ5KTlI6Oj9LS0/v8/b7UI3JzdMPDxIqKi5aWl7y9vi4uL8fHx3BwcNvc3pKSk62usCsrLN/f4Ly8vZydnp2dndXV1snJycXGym5vcefn6IuMjYWFhYODhiMjJCYmJ+fo6UhISR8fH/7+/hsbHP39/ejo6cHWLu/v8Lq7vPv7++nq6+3u7q+wsby9wL6/wvj4+Pz8/Pr6+vLy8+bn6O7u7vj4+e3u7/f3+PT19fn5+ff39/T09Pb29+jo6MHWL/b29vLy8vT09e7v8L2+v/Pz9O7u7/39/vHy9L2+wbi6ve/v7+no6fz9/fn6+vj5+fv7/Pr7+////v7//8XGx/X19vX29vb39+7v7/z8/enp6uPk5fr6+/n5+g8PENTU1Hh4eYeHh05OT+fo6JGSk0BAQOTl6CAgIS8vML+/wHNzc5eYmLa3t+Xm54OEhfn4+Y+PkFdXV1hZWv3++IiIiJGRkZubm3t8ff7+/35/gOjp6ru8vmRkZMTFyLO0tWJiY6eoqycnKGxsbkNDQ77TIl5eX6Kjo+Xm6QcHBwgICZSUlvLz8y0tLv///wAAAP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyMUExNDAzQjE2NzExRTNBMUE1RTA3Qjc0NDg0NDMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyMUExNDA0QjE2NzExRTNBMUE1RTA3Qjc0NDg0NDMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDIxQTE0MDFCMTY3MTFFM0ExQTVFMDdCNzQ0ODQ0MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDIxQTE0MDJCMTY3MTFFM0ExQTVFMDdCNzQ0ODQ0MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAD/ACwAAAAA9AHmAAAI/wD/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggAQWaOCBCCao4IIMNujggxBGKOGEFFZIYD+gZKDDMzB06OGHIIYo4ogklmjiiSimqOKKLK54hg4TVGJhSqEYEscAR6zgz4489ujjj0AGKeSQRBZp5JFIJqnkkjuusIUELEgxyYwi7WLODv6s4Eg9TLCgwJdghinmmGSWaeaZaKap5ppstunmm3mccwIlOu7RiSZUdqQJHkf4MwAeMATTz6CEFmrooYgmquiijDbq6KOQRirppIdyUIU2lPhzzQhT5onRGVi20QkwlJZq6qmopqrqqoSOQogY/pD/kICnFfUzhD8UEEIHq7z26uuvwC5Khh0rOEMArRJN4oQ/PayBKBpCqKEHLdRWa60eL4Cg7bbcduvtt+CGK+645JZr7rnoptvtArAkOkimKSD7UD8y+NPBMYZOAkI0J7TBTwgABywwwPHkuMLBCCes8MIMN+zwwxBHLPHEFFdsMcL5oHDCNtMcisMA/pgjb0NI+FMPqYVmU08IkjwSQiAwxyxzzPxsweTNOOes8848A0lBGhcYqkgb/mQzskJ3+CONoIROIMMjYgTCz9RUV2311Hs40/PWXHftdc65GroACkdkcPRBuziDghSFrhHJNVJfLbfV2Dyi49d456033lbI/1KoCSsM0OnZA5XhjwuFztGDI3M3TrfNe0cu+eRKSuM3oUz4EwDhAxlgcqEXVMO446Tzswc/fVKu+uqs+yNOobEEQkExnP8jDT5zEKqJFSiU7js2KLQu/PB5b1BoGP7ow3kMK3RQaArX+C49NhQQb/31Oh9hAKGrBHKNjGfn4Q8thCZQTTzS+75HIPhg7/77R5ZRKB7+6HBaJZrkr//+/Pfv//8ADCD/QtGPnQwgBO0alD16l77fYQl+EIxgj5xxBkJ1wR9MMM0qBkCBDnrwgyAMoQhHSMISgnALZ9AJK/LBg0KJQwwNnJ7WJEhD+CFBd20IRAFJowh/RGIRKgiiEP+HSMQiGvGISEyiCshhOAvohAD+sAehcICNuMWQdNiIx91qyEXi9aBQVnAGK0rjCn8cQoX+cGJOkJcDQnEDhlf8HeS6SEfWUaJjgxJfDMjojxygUY04kYM/gjYoOYwujr5LXR0XOTkQEGoE/pgDH/2YE1akUSeMoIAtCBUBBiISi7BipCj3FgBCFcEfnZgkGs0xiQAObiXaoIAQCHUOT37ScdQbpS6/FgZCEcMfI1BlTkqQjxWU8AjQcEksZzmoTt6ydOvLxy6n2TMEEIoG/mCDMHEiBH/sIBLzCKc4w8kFZ8QDfLCUJSdt+cy5YeMa1Ixnzqw5KGwu4pWgKSMlcVL/Cn/0YVFcCAE6E9IPDAjDI8tcZztLh40ZyvOhSKJnP+y5CtLoUyf9TEM/asHRjnK0HxIQaEMEIIIdbiShzWTnQq+2hxBsEaIwFZJEsfmBG9xiNBfNST950AoP+PSnPr1BD0TKkAb4QARo4AhK++HMleIyUzGNKpBm6o+aVlQ0OeWnP3iACkV49atercVQB5qQBsCBAQ0Yx0nVmVKnOm4Pe1CkVOdK1Q+MwhY47SNGt9pVsH5VrERdiFkvAQcIVEAjS22qW935iLk61h91HYUlTPqZrN5kp331qyIAS1aEDPYSWIACBjKSWJUutmrYmONjYRrZDISCMV+wwAhmS9va/9q2ti6Ihhn3ylXNhnWsDfksaOugBYyU9rSNi+ZqY9paUSwGBjszAW8z61fOBhcOl8hudn0wA8pK5LjIdWfwlgvR1qpiMdzwxwYuEIT2uve97fXDM9iQhTCEARBT8McTEMIM7w5EFK0IsICT4N9JOPcgqhBwK1bRWYHs9Bu8iLCEIywL4BYVu9rNLgNEcFCKgDe8cssleeXZWlAsxgX+qMJDWrEGHODAGizQ70GGwYcDF6QSTQABDL7A4y8YAZ//EIQZ8FSQJLyACj/4wg9A0A51HKSf78CEIKZM5SlPoAfnvG6Gs/sKtNrAw2xlqmlBbLpAvHTEuizxYgLgjztAZP8ZP2jBAuIgY4NMQg02JkgoilBRQxlEEw4AwRgMkoomyIhQtjADGQzSzxOAIBeQjjSklXDABhtEuBl+RWEP+90wK5bMdHsgmnep5q/AIgaCMAAITOACC9iDBRtgxDmmUIZ6nEAa86iGrnfN6177ugfzIEEI/CHdh2giznOuc0EmsYQ8D2TPSWDIMogwinaQtdA3JcgFjMBof5ygCboIt7jD/YJKa3nLWx5tRD4MaqtlbdSkvmZVR5EBE3+FFa4IwhfuwA02pCAO0ThHH9ghDlz7yxGSSLjCF87whl/jGiGoHjciAudk79fOzT4ItBfC7Bv8AwRCKAi2CwIEKnS7A2P/6ILKV65yQbQhsArBNLpBC4B1e3rMoK7bmeFNx1KHhVCTCLrQhV6Johv96EhP+tH/oQgcvEFzEZHFFyx+EGY7WyAbV4gQHDClBIDglSMfSD9aMOiC9POfigqopQsi85lz178JYXe7Uatanvdc3natd2Jg4Qc7QB0ilfgB1TF+9X+Eoh2gqIQpTKEK7/YDBBMQyCSaUAKCpEIJlQgFKJpxgBY0IRndRnui1H7umWv3FXUoQIcZIve5Yw11dl+kzw1jDBzkd3MQmYQRBr/sjBvk8EnoBggI8IXXEqQVRTD+Py4AA8urIRQXAAEVqCAIIpvdH/LDhPa3r31ghHTtBGn7/8w1LQC1sv7mrg+xI2Jfx9kXpva3j0g/1sB7glhd40VAxT8IZRAjVN8WQsAKoFAEpjAQI8d/CLFTPQVUPyVUMFdWGGZ6mXYJr/BlC9F66ccPIsZ+NeR+hAF/f/cQuld/A3F/v1cE0YYQqvACzCAKa0AEHvAPLmaATZBtC4FZvrVZFiZYESiBXEYPBQB3BYGB6bc+7cOBNOSBg2EK9wANIegQlSBndHZxvVd4WXcQOtACBrEKL0BkYXeDfJWD1nVhPqhdWOADACCEQ4h+GXg12CAJSJiEeEdv9uYVoFACysBecwACNKAH3NAJCJACLBAHi8AI6QANMpCIiriIjNiITv/QAT0AT7j3EMUwdVNYdb5XEHtWhzfWDgdgEI9nCQLxhQqBg741hjxYhqB1CcXlEESYgQ0VhxGkhFnBCooQBARgAgGAAIVQDioADVdgBeFAAj1wQDuwBciYjMq4jMy4BZIgO8QWERkgeJeIcaOQeaGQjVNyeCWAjdkIPg/wdQdhC0owJbJADOA3EKaoWagYcz04c1jwCpzmimzYhnTjUrIIP7SYFUA3dEOndAAZkEj3D5DEB4DXAlKobATRD0agBg7wkA7QBGZzC1QAkQ+5BF8wJYawCwgxCVRAO6LQAkD2ZGF4ijvojhLYZRBggQ/xirAIVfmIPfsYGP0ACP6QCf3/4I86OXSkYARGMAbiQ4UFkZP+uENE6Y8CMSgEZZQOsY7VdZIQKIF1IALmBxEuWYRxFZMyOYd6lxiTAA7+sA0LMAdkiZBm2QI7xmMw4AB60JZK4A0KaRNOCVbtGJXohnqqNxFXmX7YEEpaSTwzCRiToA87YzQ6VZLsCJWe9Y7ZRQ8zUBF76XqBwEF/CZhcyYmGIQqCwAiJ8Aae+QaJEJqJEAWkWZpXUJpRYAcnoFeH2Vsm+YCLuWWhVXOQWY/2yFKBIE2V2TqB+RemAATFEJw1MJzEyQEchQvImZzJSQfrwJpa5ZqJCZsHgWlYcAnzCGbMJGa32TjvtJu8eZlgkS///2h02ZiNwAAM+RMMorCeouALqqAKv/ALiwcKSYAK9mmfq3ADMQAE/BkDE7AJABqgm6AOBFqgkHCgB8BmBtma1EWXijmdGKZphmVctrmddFM93qk6vTkVhUJ0ldALoZA/66kKpgAKqNAKwSkLHMAB+xALB1ACJUAGu4AMp3AKnCAE/Nmfm5Cj/fmfAgqgBWqgCKqgvGUKlnCkSHqkFSadl4ZdXZZWpFWhFko1LbVzGZo3GyoVHRp0RQeiIaoJI1qiq7AKsFAMqZAKK1oLLgqjMYoJszALNWqjOMqjQOCfPwqkQaoOBwoJCeoPC/qcC8iAHuCA6SgQZoWXSRWl2flpU/+KWjB5pXuTpVGxpZPQpdkooqJAoqAwpmV6pmm6pjBKBm4KpzV6o3Rapz76o3mqp0Pqp3slDmtgkRbZBS9XqP9gVm+3VouKc1OKDXIFqXgjqVBBqZb6pWG6qWRqpmhqnKDapm8ap6ZKp3Z6p6u6p336pzfRTVwAD17Qrd7arVkQCI9gq0bVirqqUI0aYo0FrHojrE9BrB96qWCaqWKarJ7KrC8aqqMKrXPKo9OqqnlqrUSqU1bqI9gwkkPZAOqmVFKarlOTWuyKpeDpFfDqpZiqqZyqrJ+ar85KqnJ6qv8qoNXaqvt0E6zgDG2AB0ywsizLBI2wDfYgCA3RDyzJsLv/6rBysz6/GrHVNLFdUbHG+p4mmqyyoKJqegD5OqM0eqP9GgMxsKP+mqoiG7AI6g761Q8CmbVau7UCOQkJ4AzyowFiO7YacAAIixJLVUs4G2LjxbNc00uD8kt5h5lbcSjD4I9HlwzJUJ7yuj/q2Z6+ELjN8J7v6QuxsJ89eqcDSrV8CgYrkA5q8AmSO7mUW7mWe7mYm7ma+wlFAAgrYAVJsKeiSwq2OhKZxAmEkg68mq4b6LY8ww2E8gL+sAh0qBi/ALWoqrgj27grEAGI4AnAG7zCO7zEW7zGe7zI6wkmwAb+8A6hK7oHSrowUQ7+IAiEQg2HtLZVsz4F67pL8gWE/9IJ/sACtdCViHG7ORqyAbq7B+C4jdACShC/8ju/9Fu/9nu/+Ju/SgACjgu60Bu9pSsSCNBmhJINcKS9oea9O3MN2QmWAUAG5nsY6Ju41Mq4BzAC+DAPU5AGHNzBHvzBIBzCIjzCJJwGwegP7PC80Cu9L7EAIUMogjAAVoTAVBOLCowzXOBC+dACCRDBhgEKkLC+BPq/pFDERmzEp6AGj1pDcpAK/wsJLOwSxeAM71Ao7JC9NGw6WnTDN/MH3OMI8aAOluDDhXGUO3nGQ5cKQJADgDACnfDGcBzHcjzHdFzHdnzHbwwILkAKrLrCASwSbeAItUAogIDFWQyxXKwkFP9gvYNCBf5UC4pAxpvxC6QwC2WLtJicyZq8yZzcyZ78yZl8A33sxzGhAJpDKLVAAo+QxdsLe4mMJFFQKOcATDcQyXS7GaZACk+8y7zcy778y8AMxX8cErtwBCdQKJ3gCDN8yOv3ykYiCWNAKDewAyGQAcpgy6GRy8G8zdzczbwcxS+RXw5QKFEgCayMWhjqzEMiRYSyDf4gB5CMzaChzd5cz/YMzODsEsqwAtJQKAkgDaubrsqlzkHiBIWiDDvgCDoQA14lyZpBz/cc0RK9p/nsEhHgD1kAOpEQ0I3anQT9I++ADoUiD/4wBLLwVQ6dGRA90SxdzxXdEqxwjBVEKFL/0AHPeM4a6FAfjUGGYgH+wAUxcM0NfcsPrcstfdTd/NIt4TltkACFcgzgADzLvLZVutOBAAaGQgUUsAUtYAtglQHnNc9GjdRkHSNmrJNquBL9QGcn0AqGQgR2MAAogAIvMzN2fdd4ndd6jdd7UHdcHAJ4QAaG4gZ0wgbxjNKFV9RkvdgxkNY3UQzawCxs06FjkALywAVtIMMI7AwrgA+e/dmgHdqiPdqkXdqmfdqondqqTdpHsANcoA0ugC+GQgA2Qwgn7VceoHyesdKLzdKNHRSmgAl+dw00kCiwEAt+EGjqstznAgNEYADQHd3SPd3UXd3Wfd3Ynd3avd3cbd2K/8AKipICnK0AsmAJmjVZ2TzWve3bjm0TmmAJozAEfQINJRAs9n3f+J3fjaID4aApYFDevsWR6b3eR/3bQNEPSmoCRLMD+lAK+v3gEB7hqqIDTtAn4hAEh43bRK3YBM7eQlELHqAIZGAJcmAzFCAPLjABkyDhLN7iLo61YxAGt+MPbYAANyAEOehVZ5sZogAEcfrjnBDkQj7kRF7kRn7kSF7kQiDYQhEKIa4IylALc0Y0/nAEe8ADEQAOG7DlXN7lXv7lYB7mYj7mZF7mZn7maJ7mao7m5bAI0LAy7ZMPXIAAExAL5p3ji1Y7/+DVXxUDtTABL8AIkRACurnT2OMMgf+wMQRwA7Eg1DnuWnpueBngV8qACbJwA1JgCC+QCZze6Z7+6aAe6qI+6qRe6qZ+6qie6qq+6qzOB0FAChwlBHee44rgAZUX6f8A4r5lCROQANz368Ae7MI+7MRe7MZ+7Mie7Mq+7Mwe7Lbgn7NO615lCTsuL/0gBE8u7dq+7dze7d7+7eAe7uI+7uOeAYlNOJUQ7eS+7uze7u7+7vAe7h4wRriuZ+oe7/ie7/q+7/zuVR4wCu19NqFw7/1e8AZ/8Aj/Vf8e8OieANme8BAf8RJP7h4AC/WuEP3ACj418Rzf8R7vVxmQALp98QhRCTeQAQ//8Sq/8vnuARkwAY1H8lDdyAoxAFQsf/M4/+0/pQiYEPMyDxH9EAqwUAu2MAHKkKRIn/RKv/RM3/RO//RQH/VSP/VUX/VJqgwxEAusIArV/vMMMShoHPZiP/ZkX/Zmf/Zon/Zqf/ZK6fVu//ZwH/dyP/d0X/d2f/d4n/d6v/d83/d+//eAH/iCP/iEX/iGf/iIn/iKv/iM3/iO//iQH/mSP/mUX/mWf/mYn/mav/mc3/me//mgH/qiP/qkX/qmf/qon/qqv/qs3/qu//qwH/uyP/u0X/u2f/u4n/u6v/u83/u+//vAH/zCP/zXERAAOw=="></a>';
    var MOVE_HAND_OVER_LEAP_ICON = '<a href="#" onclick="this.style.display = \'none\'; return false;"><img id="connect-leap" class="playback-move-hand" style="margin: 0px 2px -2px 0px;" src="data:image/gif;base64,R0lGODlh9AHtAPf/AJ2dnfT09KWlpZWVlejo6bGxsRwcHHl5eYmJiRMTFOrq66GhoYWFhcHCxObm54GBgdjY2GFhYcXGydPT0+Dg4OPj4319fQsLC0ZGRuTk5GlpaVVVVV5eXpGRkXFxcd7e3kFBQXV1ddbW1lJSUsDAwNvb221tbk1OTgMDAykpKaurqzw9PdTU1FlZWdzc3JiYmMjKzLu7u8jIyJubnPLy9M7Ozr2/wUlJSTo6OsLCwmRkZDY2NtDQ0DIyMr29vaytsKysrC4uLra2ttHS1CUlJtXX2MrKy6+vr5qamiEhIczMzM3O0LS0tMTExMbGxsbIyt7e4I2Njby8vOTl5qioqMPEx+rr7KqqrOjo6np6fNTV17i4uMzNzo+Pj3Z3ePHx8rm7veDh4uzt7r/AwoeHh8PDxM/Q0sTFx42OkMDBw+fo6bW3utjZ2vHy8tHR0sjJyru8v+Xl5d3d3dzc3mNjZJ+fn2pra+np6t/f4OLj5NPT1V9fYFdXV8HCxsDBxbO0tq6vsqqsrk9PT0tLS5KTlGdnZ4uMjn1+gHd4e1JTUzs7PEJCQzMzMysrK+fn6P7+/v////39/fPz8+7u7/z8/Pv7+/f39/b29vr6+vj4+Pn5+e7u7vLy8u/v7+3t7ezs7PDw8Ozs7fHx8fDw8fb29/Ly8/X19fr6+/z8/fn5+tvc3e/v8HNzdKmpqvf3+CMjJPDx8fP09OPk5ZmZmvj5+Xt8flBQUP39/mtsbvLz8+/w8Nra3NXW15+govr7+x8fH7m5uicnJ+fn6ezt7Zqcn7Kzs7S0s1hYWLe4uvz9/aanqq2trf3+/ouLi2NkZqOjo5aXmqKkppeYmmBgYPv7/JSVl4ODg4eHihcXFw8PD/7//9HS0kBAQOHh4mhoa0RERDAwMPf4+AcHB+vr7NfX11xcXKenp5manJqameXm6ExMTcjHyfv8/G9vb/j4+UdHRywsLHN0dj4+PsrLzTQ0NObm6Obn6efm6Ly9v39/fzc4OL2+v+3s7fb39wAAAP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyMUExNDA3QjE2NzExRTNBMUE1RTA3Qjc0NDg0NDMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyMUExNDA4QjE2NzExRTNBMUE1RTA3Qjc0NDg0NDMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDIxQTE0MDVCMTY3MTFFM0ExQTVFMDdCNzQ0ODQ0MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDIxQTE0MDZCMTY3MTFFM0ExQTVFMDdCNzQ0ODQ0MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMi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" /></a>';
  
  
    /**
     * Player is a recorder of frames. Note that it constantly overwrites
     * itself when the frames exceed the maxFrames.
     *
     * @param options {Object|number} an optional value to set the number of frames trapped or a hash of options
     *  - maxFrames {number}
     *  - onMaxFrames {function} a callback for when the frame limit is hit
     *
     *
     * @constructor
     */
    function Player(controller, options) {
      var player = this;
      this.frameData = [];
      this.maxFrames = 10000;
      this.options = options;
      this.frameIndex = 0;
      this.controller = controller;
      this.scrollSections = this.options.scrollSections;
      this.loading = false;
      this.setupLoops();
      this.controller.connection.on('ready', function(){
        player.setupProtocols();
      });
  
      if (options) {
        if (!isNaN(options)) {
          this.maxFrames = options;
        } else if (options.maxFrames) {
          this.maxFrames = options.maxFrames;
        }
  
        if (options.onMaxFrames) {
          this.on('maxFrames', options.onMaxFrames.bind(this));
        }
  
        if (options.recording) {
          this.loadFrameData(options, function(){
            // initializes frameIndex and stuff
            this.setFrames(options.recording);
            this.metadata = options.recording.metadata;
            options.onReady.call(this);
          })
        }
  
        if (options.scrollSections && options.scrollSections.length > 0){
          for (var i = 0; i < options.scrollSections.length; i++){
            this.loadFrameData(options.scrollSections[i])
          }
          this.play();
        }
      }
    }
  
    Player.prototype = {
      setupLoops: function () {
        var player = this;
  
        // Loop with explicit frame timing
        this.stepFrameLoop = function () {
          if (player.state != 'playing') return;
          player.sendFrame(player.currentFrame());
  
          if (!player.options.loop && (player.currentFrameIndex > player.frameIndex)) {
            player.pause();
          }
  
          setTimeout(
            player.stepFrameLoop,
            player.timeToNextFrame()
          );
  
          player.advanceFrame();
        }
  
        // Loop with frames timed to animation frames
        // Used with scroll sections
        this.stepAnimationLoop = function () {
          if (player.state != 'playing') return;
          player.sendCurrentSectionFrame();
  
          requestAnimationFrame(player.stepAnimationLoop);
        }
      },
      
      // This is how we intercept frame data early
      // By hooking in before Frame creation, we get data exactly as the frame sends it.
      setupProtocols: function () {
        var player = this;
        // This is the original normal protocol, used while in record mode but not recording.
        this.stopProtocol = this.controller.connection.protocol;
  
        // This consumes all frame data, making the device act as if not streaming
        this.playbackProtocol = function (data) {
          // The old protocol still needs to emit events, so we use it, but intercept Frames
          var eventOrFrame = player.stopProtocol(data);
          if (eventOrFrame instanceof Leap.Frame) {
  
            if (player.pauseOnHand){
              if (data.hands.length > 0) {
                player.setGraphic();
                player.idle();
              }else if (data.hands.length == 0){
                player.setGraphic('wave');
              }
            }
  
            return {type: 'playback'}
          }else{
            return eventOrFrame;
          }
        };
  
        // This pushes frame data, and watches for hands to auto change state.
        // Returns the eventOrFrame without modifying it.
        this.recordProtocol = function (data) {
          var eventOrFrame = player.stopProtocol(data);
          if (eventOrFrame instanceof Leap.Frame) {
            player.recordFrameHandler(data);
          }
          return eventOrFrame;
        };
  
        // Copy methods/properties from the default protocol over
        for (var property in this.stopProtocol) {
          if (this.stopProtocol.hasOwnProperty(property)) {
            this.playbackProtocol[property] = this.stopProtocol[property]
            this.recordProtocol[property] = this.stopProtocol[property]
          }
        }
  
        // todo: this is messy. Should cover all cases, not just active playback!
        if (this.state == 'playing'){
          this.controller.connection.protocol = this.playbackProtocol
        }
      },
  
      currentFrame: function () {
        return this.frameData[this.frameIndex];
      },
      
      nextFrame: function(){
        var frameIndex = this.frameIndex + 1;
        // || 1 to prevent `mod 0` error when finishing recording before setFrames has been called.
        frameIndex = frameIndex % (this.rightCropPosition || 1);
        if ((frameIndex < this.leftCropPosition)) {
          frameIndex = this.leftCropPosition;
        }
        return this.frameData[frameIndex];
      },
  
      advanceFrame: function () {
        this.frameIndex += 1;
        this.frameIndex = this.frameIndex % (this.rightCropPosition || 1);
        if ((this.frameIndex < this.leftCropPosition)) {
          this.frameIndex = this.leftCropPosition;
        }
      },
  
      // returns ms
      timeToNextFrame: function(){
        var elapsedTime = (this.nextFrame().timestamp - this.currentFrame().timestamp)  / 1000;
        if (elapsedTime < 0){
          elapsedTime = this.timeBetweenLoops; //arbitrary pause at slightly less than 30 fps.
        }
        return elapsedTime;
      },
  
  
      // Adds playback = true to artificial frames
      sendFrame: function (frameData) {
        if (!frameData) throw "Frame data not provided";
        // note that currently frame json is sent as nested arrays, unnecessarily.  That should be fixed.
        var frame = new Leap.Frame(frameData);
  
        // send a deviceFrame to the controller:
        // this frame gets picked up by the controllers own animation loop.
        this.controller.processFrame(frame);
        this.currentFrameIndex = this.frameIndex;
        return true
      },
  
      // returns false unless sections are defined
      // returns true and sends a frame for the first possible section
      sendCurrentSectionFrame: function () {
        if (!this.scrollSections) return false;
        var section;
  
        for (var i = 0; i < this.scrollSections.length; i++) {
          section = this.scrollSections[i];
          section.completion = (window.innerHeight + document.body.scrollTop - section.element.offsetTop) / section.element.offsetHeight;
          if (section.completion > 0 && section.completion < 1) {
            this.setSectionPosition(section);
            return true
          }
        }
        return true
      },
  
      // used after record
      stop: function () {
        this.setFrames({frames: []});
        this.idle();
      },
  
      // used after play
      pause: function () {
        // todo: we should change this idle state to paused or leave it as playback with a pause flag
        // state should corrospond always to protocol handler (through a setter)?
        this.state = 'idle';
        if (this.overlay) this.hideOverlay();
      },
  
      idle: function(){
        this.state = 'idle';
        this.controller.connection.protocol = this.stopProtocol;
      },
  
      // switches to record mode, which will be begin capturing data when a hand enters the frame,
      // and stop when a hand leaves
      // Todo: replace frameData with a full fledged recording, including metadata.
      record: function(){
        this.stop();
        this.frameData = [];
        this.frameIndex = 0;
        this.state = 'recording';
        this.controller.connection.protocol = this.recordProtocol;
        this.setGraphic('connect');
      },
  
      recordPending: function(){
        return this.state == 'recording' && this.frameData.length == 0
      },
  
      recording: function(){
        return this.state == 'recording' && this.frameData.length != 0
      },
  
      finishRecording: function(){
        // By doing play + pause, we change to the playbackHandler which suppresses frames:
        this.play();
        this.pause();
        this.setFrames({frames: this.frameData});
        this.controller.emit('playback.recordingFinished', this)
      },
  
      setFrames: function (recording) {
        if (recording.frames) {
          this.frameData = recording.frames;
          this.frameIndex = 0;
          this.maxFrames = recording.frames.length;
          this.leftCropPosition = 0;
          this.rightCropPosition = this.maxFrames;
        }
      },
  
      loaded: function(){
        return this.frameData && this.frameData.length
      },
  
      // sets the current frame based upon fractional completion, where 0 is the first frame and 1 is the last
      // accepts an options hash with:
      // - completion [Number, 0..1]
      // - recording
      setSectionPosition: function (section) {
        if (section.recording.frames === undefined) return; // whilst AJAX in-flight
        var frameIndex = Math.round(section.completion * section.recording.frames.length);
  
        if (frameIndex != section.currentPosition){
          section.currentPosition = frameIndex;
          this.sendFrame(section.recording.frames[frameIndex]);
        }
      },
  
      setFrameIndex: function(frameIndex){
        if (frameIndex != this.frameIndex){
          this.frameIndex = frameIndex % this.maxFrames;
          this.sendFrame(this.currentFrame());
        }
      },
  
      // sets the crop-point of the current recording to the current position.
      leftCrop: function(){
        this.leftCropPosition = this.frameIndex
      },
  
      // sets the crop-point of the current recording to the current position.
      rightCrop: function(){
        this.rightCropPosition = this.frameIndex
      },
  
      /* Plays back the provided frame data
       * Params {object|boolean}:
       *  - frames: previously recorded frame json
       * - loop: whether or not to loop playback.  Defaults to true.
       */
      play: function (options) {
        if (this.state == 'playing') return;
        if (this.loading == true) return;
  
        this.state = 'playing';
        this.controller.connection.protocol = this.playbackProtocol;
        if (options === undefined) {
          options = true;
        }
  
        if (options === true || options === false) {
          options = {loop: options};
        }
  
        if (options.loop === undefined) {
          options.loop = true;
        }
  
        this.options = options;
        this.state = 'playing';
        var player = this;
  
        // prevent the normal controller response while playing
        this.controller.connection.removeAllListeners('frame');
        this.controller.connection.on('frame', function (frame) {
          if (player.autoPlay && player.state == 'idle' && frame.hands.length == 0) {
            player.play();
          }
  
          player.controller.processFrame(frame);
        });
  
        // Kick off
        if (this.scrollSections){
          this.stepAnimationLoop();
        }else{
          this.stepFrameLoop();
        }
  
      },
  
      // this method replaces connection.handleData when in record mode
      // It accepts the raw connection data which is used to make a frame.
      recordFrameHandler: function(frameData){
        // Would be better to check controller.streaming() in showOverlay, but that method doesn't exist, yet.
        this.setGraphic('wave');
        if (frameData.hands.length > 0){
          this.frameData.push(frameData)
          this.hideOverlay()
        } else if ( this.frameData.length > 0){
          this.finishRecording()
        }
      },
  
  
      // IO
  
      // optional callback once frames are loaded, will have a context of player
      // replaces the contents of recordingOrURL in-place when the AJAX has completed.
      loadFrameData: function (options, callback) {
        if (typeof options.recording !== 'string') {
          if (callback) {
            callback.call(this, options.recording);
          }
        } else {
          var xhr = new XMLHttpRequest(),
            player = this,
            url = options.recording;
  
          xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE) {
              if (xhr.status === 200 || xhr.status === 0) {
                if (xhr.responseText) {
  
                  options.recording = xhr.responseText
  
                  if (url.split('.')[url.split('.').length - 1] == 'lz') {
                    options.recording = player.decompressJSON(options.recording);
                  }
  
                  options.recording = JSON.parse(options.recording);
  
                  player.loading = false;
                  if (callback) {
                    callback.call(player, options.recording);
                  }
                  player.controller.emit('playback.ajax:complete', player);
  
                } else {
                  console.error('Leap Playback: "' + url + '" seems to be unreachable or the file is empty.');
                }
              } else {
                console.error('Leap Playback: Couldn\'t load "' + url + '" (' + xhr.status + ')');
              }
            }
          };
          player.loading = true;
          player.controller.emit('playback.ajax:begin', player);
          xhr.open("GET", url, true);
          xhr.send(null);
        }
      },
  
      // INTERFACE
  
      hideOverlay: function () {
        this.overlay.style.display = 'none';
      },
  
  
      // Accepts either "connect", "wave", or undefined.
      setGraphic: function(graphicName){
        if (this.graphicName == graphicName) return;
  
        this.graphicName = graphicName;
        switch(graphicName) {
          case 'connect':
            this.overlay.style.display = 'block';
            this.overlay.innerHTML = CONNECT_LEAP_ICON;
            break;
          case 'wave':
            this.overlay.style.display = 'block';
            this.overlay.innerHTML = MOVE_HAND_OVER_LEAP_ICON;
            break;
          case undefined:
            this.overlay.innerHTML = '';
            break;
        }
      },
  
  
      // EXPORTING
  
      // removes every other frame from the array
      // Accepts an optional `factor` integer, which is the number of frames
      // discarded for every frame kept.
      cullFrames: function (factor) {
        factor || (factor = 1);
        for (var i = 0; i < this.frameData.length; i++) {
          this.frameData.splice(i + factor, 1);
        }
      },
  
      // Returns the average frame rate of the recording
      frameRate: function(){
        return this.frameData.length / (this.frameData[this.frameData.length - 1].timestamp - this.frameData[0].timestamp) * 1000000;
      },
  
      // returns frames without any circular references
      croppedFrameData: function(){
        return this.frameData.slice(this.leftCropPosition, this.rightCropPosition);
      },
  
      setMetaData: function(){
        var newMetaData = {
          formatVersion: 0.1,
          generatedBy: 'LeapJS Playback 0.1-pre',
          frames: this.rightCropPosition - this.leftCropPosition,
          protocolVersion: this.controller.connection.opts.requestProtocolVersion,
          frameRate: this.frameRate().toPrecision(2)
        }
        if (this.controller.connection.protocol){
          newMetaData.serviceVersion = this.controller.connection.protocol.serviceVersion;
        }
        for (var key in newMetaData) { this.metadata[key] = newMetaData[key]; }
      },
  
      toHash: function(){
        this.setMetaData();
        return {
                frames: this.croppedFrameData(),
                metadata: this.metadata
              }
      },
  
      // Returns the cropped data as JSON or compressed
      // http://pieroxy.net/blog/pages/lz-string/index.html
      export: function(format){
        var json = JSON.stringify(this.toHash());
  
        if (format == 'json' ) return json;
  
        return this.compressToBase64(json);
      },
  
      decompressJSON: function(data){
        return this.decompressFromBase64(data)
      },
  
      // these compression methods yanked from LZString. Gracias WTFPL.
      // private property
      _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      _f : String.fromCharCode,
  
      compressToBase64 : function (input) {
        if (input == null) return "";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
  
        input = this.compress(input);
  
        while (i < input.length*2) {
  
          if (i%2==0) {
            chr1 = input.charCodeAt(i/2) >> 8;
            chr2 = input.charCodeAt(i/2) & 255;
            if (i/2+1 < input.length)
              chr3 = input.charCodeAt(i/2+1) >> 8;
            else
              chr3 = NaN;
          } else {
            chr1 = input.charCodeAt((i-1)/2) & 255;
            if ((i+1)/2 < input.length) {
              chr2 = input.charCodeAt((i+1)/2) >> 8;
              chr3 = input.charCodeAt((i+1)/2) & 255;
            } else
              chr2=chr3=NaN;
          }
          i+=3;
  
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
  
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
  
          output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
              this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
  
        }
  
        return output;
      },
  
      decompressFromBase64 : function (input) {
        if (input == null) return "";
        var output = "",
            ol = 0,
            output_,
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0, f=this._f;
  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
        while (i < input.length) {
  
          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));
  
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
  
          if (ol%2==0) {
            output_ = chr1 << 8;
  
            if (enc3 != 64) {
              output += f(output_ | chr2);
            }
            if (enc4 != 64) {
              output_ = chr3 << 8;
            }
          } else {
            output = output + f(output_ | chr1);
  
            if (enc3 != 64) {
              output_ = chr2 << 8;
            }
            if (enc4 != 64) {
              output += f(output_ | chr3);
            }
          }
          ol+=3;
        }
  
        return this.decompress(output);
      },
  
      compress: function (uncompressed) {
          if (uncompressed == null) return "";
          var i, value,
              context_dictionary= {},
              context_dictionaryToCreate= {},
              context_c="",
              context_wc="",
              context_w="",
              context_enlargeIn= 2, // Compensate for the first entry which should not count
              context_dictSize= 3,
              context_numBits= 2,
              context_data_string="",
              context_data_val=0,
              context_data_position=0,
              ii,
              f=this._f;
  
          for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
              context_dictionary[context_c] = context_dictSize++;
              context_dictionaryToCreate[context_c] = true;
            }
  
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
              context_w = context_wc;
            } else {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                if (context_w.charCodeAt(0)<256) {
                  for (i=0 ; i<context_numBits ; i++) {
                    context_data_val = (context_data_val << 1);
                    if (context_data_position == 15) {
                      context_data_position = 0;
                      context_data_string += f(context_data_val);
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i=0 ; i<8 ; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == 15) {
                      context_data_position = 0;
                      context_data_string += f(context_data_val);
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i=0 ; i<context_numBits ; i++) {
                    context_data_val = (context_data_val << 1) | value;
                    if (context_data_position == 15) {
                      context_data_position = 0;
                      context_data_string += f(context_data_val);
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i=0 ; i<16 ; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == 15) {
                      context_data_position = 0;
                      context_data_string += f(context_data_val);
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i=0 ; i<context_numBits ; i++) {
                  context_data_val = (context_data_val << 1) | (value&1);
                  if (context_data_position == 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
  
  
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              // Add wc to the dictionary.
              context_dictionary[context_wc] = context_dictSize++;
              context_w = String(context_c);
            }
          }
  
          // Output the code for w.
          if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
              if (context_w.charCodeAt(0)<256) {
                for (i=0 ; i<context_numBits ; i++) {
                  context_data_val = (context_data_val << 1);
                  if (context_data_position == 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<8 ; i++) {
                  context_data_val = (context_data_val << 1) | (value&1);
                  if (context_data_position == 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i=0 ; i<context_numBits ; i++) {
                  context_data_val = (context_data_val << 1) | value;
                  if (context_data_position == 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<16 ; i++) {
                  context_data_val = (context_data_val << 1) | (value&1);
                  if (context_data_position == 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i=0 ; i<context_numBits ; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == 15) {
                  context_data_position = 0;
                  context_data_string += f(context_data_val);
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
  
  
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
          }
  
          // Mark the end of the stream
          value = 2;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
  
          // Flush the last char
          while (true) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == 15) {
              context_data_string += f(context_data_val);
              break;
            }
            else context_data_position++;
          }
          return context_data_string;
        },
  
        decompress: function (compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          var dictionary = [],
              next,
              enlargeIn = 4,
              dictSize = 4,
              numBits = 3,
              entry = "",
              result = "",
              i,
              w,
              bits, resb, maxpower, power,
              c,
              f = this._f,
              data = {string:compressed, val:compressed.charCodeAt(0), position:32768, index:1};
  
          for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
          }
  
          bits = 0;
          maxpower = Math.pow(2,2);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
  
          switch (next = bits) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2,8);
                power=1;
                while (power!=maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                  }
                  bits |= (resb>0 ? 1 : 0) * power;
                  power <<= 1;
                }
              c = f(bits);
              break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2,16);
                power=1;
                while (power!=maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                  }
                  bits |= (resb>0 ? 1 : 0) * power;
                  power <<= 1;
                }
              c = f(bits);
              break;
            case 2:
              return "";
          }
          dictionary[3] = c;
          w = result = c;
          while (true) {
            if (data.index > data.string.length) {
              return "";
            }
  
            bits = 0;
            maxpower = Math.pow(2,numBits);
            power=1;
            while (power!=maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = 32768;
                data.val = data.string.charCodeAt(data.index++);
              }
              bits |= (resb>0 ? 1 : 0) * power;
              power <<= 1;
            }
  
            switch (c = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2,8);
                power=1;
                while (power!=maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                  }
                  bits |= (resb>0 ? 1 : 0) * power;
                  power <<= 1;
                }
  
                dictionary[dictSize++] = f(bits);
                c = dictSize-1;
                enlargeIn--;
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2,16);
                power=1;
                while (power!=maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                  }
                  bits |= (resb>0 ? 1 : 0) * power;
                  power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize-1;
                enlargeIn--;
                break;
              case 2:
                return result;
            }
  
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
  
            if (dictionary[c]) {
              entry = dictionary[c];
            } else {
              if (c === dictSize) {
                entry = w + w.charAt(0);
              } else {
                return null;
              }
            }
            result += entry;
  
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
  
            w = entry;
  
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
  
          }
        }
    };
  
    // will only play back if device is disconnected
    // Accepts options:
    // - frames: [string] URL of .json frame data
    // - autoPlay: [boolean true] Whether to turn on and off playback based off of connection state
    // - overlay: [boolean or DOM element] Whether or not to show the overlay: "Connect your Leap Motion Controller"
    //            if a DOM element is passed, that will be shown/hidden instead of the default message.
    // - pauseOnHand: [boolean true] Whether to stop playback when a hand is in field of view
    // - requiredProtocolVersion: clients connected with a lower protocol number will not be able to take control of the
    // - timeBetweenLoops: [number, ms] delay between looping playback
    // controller with their device.  This option, if set, ovverrides autoPlay
    var playback = function (scope) {
      var controller = this;
      var autoPlay = scope.autoPlay;
      if (autoPlay === undefined) autoPlay = true;
  
      var pauseOnHand = scope.pauseOnHand;
      if (pauseOnHand === undefined) pauseOnHand = false;
  
      var timeBetweenLoops = scope.timeBetweenLoops;
      if (timeBetweenLoops === undefined) timeBetweenLoops = 50;
  
      var requiredProtocolVersion = scope.requiredProtocolVersion;
  
      var overlay = scope.overlay;
      if (overlay === undefined) {
        overlay = document.createElement('div');
        document.body.appendChild(overlay);
        overlay.style.width = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '-' + window.getComputedStyle(document.body).getPropertyValue('margin');
        overlay.style.padding = '10px';
        overlay.style.textAlign = 'center';
        overlay.style.fontSize = '18px';
        overlay.style.opacity = '0.8';
        overlay.style.display = 'none';
        overlay.style.zIndex = '10';
      }
  
      scope.player = new Player(this, {
        recording: scope.recording,
        scrollSections: scope.scrollSections,
        onReady: function () {
          // it would be better to use streamingCount here, but that won't be in until 0.5.0+
          // if (autoPlay && (controller.streamingCount == 0 || pauseOnHand)) {
          if (autoPlay && (!controller.connection.connected)) {
            this.play();
            if ( this.pauseOnHand ) {
              this.setGraphic('connect');
            }
          }
        }
      });
  
      // By doing this, we allow player methods to be accessible on the scope
      // this is the controller
      scope.player.overlay = overlay;
      scope.player.pauseOnHand = pauseOnHand;
      scope.player.requiredProtocolVersion = requiredProtocolVersion;
      scope.player.autoPlay = autoPlay;
      scope.player.timeBetweenLoops = timeBetweenLoops;
  
      var setupStreamingEvents = function(){
        if (controller.connection.opts.requestProtocolVersion < scope.requiredProtocolVersion){
          console.log('Protocol Version too old (' + controller.connection.opts.requestProtocolVersion + '), disabling device interaction.');
          scope.player.pauseOnHand = false;
          return
        }
  
        if (autoPlay) {
          controller.on('deviceConnected', function () {
            if (scope.player.state == 'recording'){
              scope.player.pause();
              scope.player.setGraphic('wave');
            }else{
              scope.player.play();
              if (pauseOnHand){
                scope.player.setGraphic('wave');
              }else{
                scope.player.setGraphic();
              }
            }
          });
  
          controller.on('deviceDisconnected', function () {
            scope.player.play();
          });
        }
        controller.on('deviceDisconnected', function () {
          scope.player.setGraphic('connect');
        });
      }
  
      // ready happens before streaming started, allowing us to check the version before responding to streamingStart/Stop
  //    if (this.connected()){
      if (!!this.connection.connected){
        setupStreamingEvents()
      }else{
        this.on('ready', setupStreamingEvents)
      }
  
  
      return {}
    }
  
  
    if ((typeof Leap !== 'undefined') && Leap.Controller) {
      Leap.Controller.plugin('playback', playback);
    } else if (typeof module !== 'undefined') {
      module.exports.playback = playback;
    } else {
      throw 'leap.js not included';
    }
  
  }).call(this);
  
  //CoffeeScript generated from main/screen-position/leap.screen-position.coffee
  /*
  Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3)
  with [x,y,z] screen coordinates indicating where the hand is, originating from the bottom left.
  This method can accept an optional vec3, allowing it to convert any arbitrary vec3 of coordinates.
  Custom positioning methods can be passed in, allowing different scaling techniques,
  e.g., http://msdn.microsoft.com/en-us/library/windows/hardware/gg463319.aspx (Pointer Ballistics)
  Here we scale based upon the interaction box and screen size:
  options:
    scale, scaleX, and scaleY.  They all default to 1.
    verticalOffset: in pixels.  This number is added to the returned Y value.  Defaults to 0.
  controller.use 'screenPosition', {
    method: (positionVec3)->
      Arguments for Leap.vec3 are (out, a, b)
      [
        Leap.vec3.subtract(positionVec3, positionVec3, @frame.interactionBox.center)
        Leap.vec3.divide(positionVec3, positionVec3, @frame.interactionBox.size)
        Leap.vec3.multiply(positionVec3, positionVec3, [document.body.offsetWidth, document.body.offsetHeight, 0])
      ]
  }
  More info on vec3 can be found, here: http://glmatrix.net/docs/2.2.0/symbols/vec3.html
  */
  
  
  (function() {
    var screenPosition;
  
    screenPosition = function(options) {
      var baseScale, baseVerticalOffset, position, positioningMethods;
      if (options == null) {
        options = {};
      }
      options.positioning || (options.positioning = 'absolute');
      options.scale || (options.scale = 1);
      options.scaleX || (options.scaleX = 1);
      options.scaleY || (options.scaleY = 1);
      options.scaleZ || (options.scaleZ = 1);
      options.verticalOffset || (options.verticalOffset = 0);
      baseScale = 6;
      baseVerticalOffset = -100;
      positioningMethods = {
        absolute: function(positionVec3) {
          return [(window.innerWidth / 2) + (positionVec3[0] * baseScale * options.scale * options.scaleX), window.innerHeight + baseVerticalOffset + options.verticalOffset - (positionVec3[1] * baseScale * options.scale * options.scaleY), positionVec3[2] * baseScale * options.scale * options.scaleZ];
        }
      };
      position = function(vec3, memoize) {
        var screenPositionVec3;
        if (memoize == null) {
          memoize = false;
        }
        screenPositionVec3 = typeof options.positioning === 'function' ? options.positioning.call(this, vec3) : positioningMethods[options.positioning].call(this, vec3);
        if (memoize) {
          this.screenPositionVec3 = screenPositionVec3;
        }
        return screenPositionVec3;
      };
      return {
        hand: {
          screenPosition: function(vec3) {
            return position.call(this, vec3 || this.stabilizedPalmPosition, !vec3);
          }
        },
        pointable: {
          screenPosition: function(vec3) {
            return position.call(this, vec3 || this.stabilizedTipPosition, !vec3);
          }
        }
      };
    };
  
    if ((typeof Leap !== 'undefined') && Leap.Controller) {
      Leap.Controller.plugin('screenPosition', screenPosition);
    } else if (typeof module !== 'undefined') {
      module.exports.screenPosition = screenPosition;
    } else {
      throw 'leap.js not included';
    }
  
  }).call(this);
  
  //CoffeeScript generated from main/version-check/leap.version-check.coffee
  (function() {
    var versionCheck;
  
    versionCheck = function(scope) {
      scope.alert || (scope.alert = false);
      scope.requiredProtocolVersion || (scope.requiredProtocolVersion = 6);
      scope.disconnect || (scope.disconnect = true);
      if ((typeof Leap !== 'undefined') && Leap.Controller) {
        if (Leap.version.minor < 5 && Leap.version.dot < 4) {
          console.warn("LeapJS Version Check plugin incompatible with LeapJS pre 0.4.4");
        }
      }
      this.on('ready', function() {
        var current, required;
        required = scope.requiredProtocolVersion;
        current = this.connection.opts.requestProtocolVersion;
        if (current < required) {
          console.warn("Protocol Version too old. v" + required + " required, v" + current + " available.");
          if (scope.disconnect) {
            this.disconnect();
          }
          if (scope.alert) {
            alert("Your Leap Software version is out of date.  Visit http://www.leapmotion.com/setup to update");
          }
          return this.emit('versionCheck.outdated', {
            required: required,
            current: current,
            disconnect: scope.disconnect
          });
        }
      });
      return {};
    };
  
    if ((typeof Leap !== 'undefined') && Leap.Controller) {
      Leap.Controller.plugin('versionCheck', versionCheck);
    } else if (typeof module !== 'undefined') {
      module.exports.versionCheck = versionCheck;
    } else {
      throw 'leap.js not included';
    }
  
  }).call(this);
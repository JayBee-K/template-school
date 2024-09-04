let windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {
		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}

const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'Đã sao chéo');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
				}
			});
		})
	}
}

const handleSwiper = function (elm, obj = {}) {
	return new Swiper(elm, {
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 8000,
			disableOnInteraction: true,
		},
		slidesPerView: 1,
		...obj
	});
}


const handleCounter = function () {
	if ($('.handleCounter').length && $('.handleCounter .handleCounterItem').length) {
		const formatPrice = function (price, format = '.') {
			price = price.replace(/[^0-9]/g, '');
			price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, format);
			return price;
		}

		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('.handleCounter').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('.handleCounter .handleCounterItem').each(function () {
					let counterItem = $(this),
						counterItemValue = counterItem.attr('data-value'),
						counterItemFormat = counterItem.attr('data-format'),
						counterItemDecor = counterItem.attr('data-decor') ?? '';
					$({countNum: counterItem.text()}).animate({countNum: counterItemValue}, {
						duration: 2000, easing: 'swing', step: function () {
							counterItem.text(Math.floor(this.countNum));
						}, complete: function () {
							counterItem.html(formatPrice(this.countNum.toString(), counterItemFormat) + ((counterItemDecor != '') ? counterItemDecor : ''));
						}
					});
				});
				i = 1;
			}
		});
	}
}

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	});

	handleStickHeader();
	handleCopyValue();
	handleCounter();
});
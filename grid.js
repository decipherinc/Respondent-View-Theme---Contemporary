(function($) {

    var isFeaturephone = false; // TO BE REPLACED IN PYTHON!!
    var gridsGroupByCol, groupByCol, gridsMultiCol, multiCol;

    // Group by column functionality.
    function regroupGroupByCols(toDesktop, className) {
        var telement, celement, pos, t, r, c, currowcount, goalrowcount;
        gridsGroupByCol.filter("." + className).each(function() {
            telement = $(this);
            t = telement.attr("id").split("-")[3];
            currowcount = telement.find(".-grid-row").length;
            goalrowcount = 0;
            telement.find(".-grid-cell" + (toDesktop ? ".-grid-mobile" : ".-grid-desktop")).each(function() {
                celement = $(this);
                pos = celement.attr("id").split("-");
                r = parseInt(pos[toDesktop ? 4 : 5]);
                c = parseInt(pos[toDesktop ? 5 : 4]);
                if (r > goalrowcount) goalrowcount = r;
                while (r > currowcount) {
                    currowcount++;
                    $('<' + (isFeaturephone ? 'div' : 'tr') +
                        ' class="-grid-row ' +
                        ((toDesktop ? /-grid-cell-col-legend/ : /-grid-cell-row-legend/).test(celement.className) ? '-grid-row-col-legend ' : '-grid-row-controls ') +
                        ((currowcount - 1) % 2 ? '-grid-row-odd' : '-grid-row-even') +
                        '" id="-grid-row-' + t + '-' + currowcount + '">').appendTo("#-grid-table-" + t);
                }
                celement.toggleClass("-grid-mobile -grid-desktop").appendTo("#-grid-row-" + t + "-" + r);
            });
            while (currowcount > goalrowcount) {
                $("#-grid-row-" + t + "-" + currowcount).remove();
                currowcount--;
            }
        });
    }

    // Multi column functionality.
    function regroupMultiCols(toDesktop, className) {
        var telement, celement, pos, t, r, c, currowcount, goalrowcount;
        gridsMultiCol.filter("." + className).each(function() {
            telement = $(this);
            t = telement.attr("id").split("-")[3];
            currowcount = telement.find(".-grid-row").length;
            goalrowcount = 0;
            telement.find(".-grid-cell" + (toDesktop ? ".-grid-mobile" : ".-grid-desktop")).each(function() {
                celement = $(this);
                pos = celement.attr("id").split("-");
                r = parseInt(pos[toDesktop ? 4 : 6]);
                c = parseInt(pos[toDesktop ? 5 : 4]);
                if (r > goalrowcount) goalrowcount = r;
                while (r > currowcount) {
                    currowcount++;
                    $('<' + (isFeaturephone ? 'div' : 'tr') +
                        ' class="-grid-row ' +
                        ((toDesktop ? /-grid-cell-col-legend/ : /-grid-cell-row-legend/).test(celement.className) ? '-grid-row-col-legend ' : '-grid-row-controls ') +
                        '" id="-grid-row-' + t + '-' + currowcount + '">').appendTo("#-grid-table-" + t);
                }
                celement.toggleClass("-grid-mobile -grid-desktop").appendTo("#-grid-row-" + t + "-" + r);
            });
            while (currowcount > goalrowcount) {
                $("#-grid-row-" + t + "-" + currowcount).remove();
                currowcount--;
            }
        });
    }

    // Auto-executing code
    $(document).ready(function() {

        gridsGroupByCol = $(".-grid-group-by-col");
        groupByCol = gridsGroupByCol.length !== 0;
        gridsMultiCol = $(".-grid-multi-col");
        multiCol = gridsMultiCol.length !== 0;
        var wasMobile = true,
            isMobile, resizeTimer;

        // Enable wrapping on text field mobile labels.
        // Technically just checks if CSS tables are supported and adds a class to <body> if so.
        if ($('<div><div style="display:table;"></div><div style="display:table-row;"></div><div style="display:table-cell;"></div></div>').html().length > 37) $('body').addClass('-grid-supports-css-table');

        // On resize/orientationchange, run the necessary functions (use a timer to make sure it's not overcalled during live window dragging).
        function handleResize() {
            isMobile = $('#mobile-test').css("display") == "block";
            if (isMobile && !wasMobile) {
                if (groupByCol) {
                    regroupGroupByCols(false, "-grid-auto-optimize");
                }
                if (multiCol) {
                    regroupMultiCols(false, "-grid-auto-optimize");
                }
            }
            if (!isMobile) {
                if (wasMobile) {
                    if (groupByCol) {
                        regroupGroupByCols(true, "-grid-auto-optimize");
                    }
                    if (multiCol) {
                        regroupMultiCols(true, "-grid-auto-optimize");
                    }
                }
            }
            wasMobile = isMobile;
        }
        $(window).bind('orientationchange resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });

        // Immediately handle no-optimize grids.
        if (groupByCol) {
            regroupGroupByCols(true, "-grid-force-desktop");
        }
        if (multiCol) {
            regroupMultiCols(true, "-grid-force-desktop");
        }

        // FIR functionality.
        if (!isFeaturephone) {
            var t;
            $('input.-grid-input-radio').after('<svg class="-fir-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0C4.5 0 0 4.5 0 10c0 5.5 4.5 10 10 10s10-4.5 10-10C20 4.5 15.5 0 10 0z M10 19c-5 0-9-4-9-9 c0-5 4-9 9-9s9 4 9 9C19 15 15 19 10 19z" class="-fir-base"/><circle cx="10" cy="10" r="9" class="-fir-bg"/><circle cx="10" cy="10" r="7" class="-fir-selected"/></svg>').change(function() {
                t = $(this);
                $('input[name="' + t.attr("name") + '"]').parent().removeClass('-fir-svg-selected');
                t.parent().addClass('-fir-svg-selected');
            }).focus(function() {
                $(this).parent().addClass('-fir-focus');
            }).blur(function() {
                $(this).parent().removeClass('-fir-focus');
            });
            $('input.-grid-input-radio:checked').parent().addClass('-fir-svg-selected');

            $('input.-grid-input-checkbox').after('<svg class="-fir-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.8,0H3.9C1.8,0,0,2,0,4.1V16c0,2.2,1.8,4,3.9,4h11.8c2.2,0,4.2-1.8,4.2-4V4.1C20,2,18,0,15.8,0z M19,16 c0,1.6-1.6,3-3.2,3H3.9C2.3,19,1,17.7,1,16V4.1C1,2.5,2.3,1,3.9,1h11.8C17.4,1,19,2.5,19,4.1V16z" class="-fir-base"/><path d="M19,16c0,1.6-1.6,3-3.2,3H3.9C2.3,19,1,17.7,1,16V4.1C1,2.5,2.3,1,3.9,1h11.8C17.4,1,19,2.5,19,4.1V16z" class="-fir-bg"/><polygon points="9.1,16.3 2.5,11 4.1,9 8.7,12.6 15.6,3.7 17.7,5.2 " class="-fir-selected"/></svg>').change(function() {
                t = $(this);
                if (t.is(":checked")) {
                    t.parent().addClass('-fir-svg-selected');
                } else {
                    t.parent().removeClass('-fir-svg-selected');
                }
            });
        }
        if (multiCol) {
            $('.-grid-multi-col .-grid-cell-legend').mouseover(function() {
                $('#' + $(this).find('.-grid-label').first().attr('for')).parent().addClass('-fir-hover');
            }).mouseout(function() {
                $('#' + $(this).find('.-grid-label').first().attr('for')).parent().removeClass('-fir-hover');
            });
        }

        // Handle cell hover formatting
        $('.-grid-cell-control, .-grid-multi-col .-grid-cell-legend').mouseover(function() {
            $(this).addClass('-grid-cell-control-hover');
        }).mouseout(function() {
            $(this).removeClass('-grid-cell-control-hover');
        }).click(function(event) {
            $('#' + $(this).find('.-grid-label').attr('for')).prop('checked', function(i, val) {
                return !val;
            }).trigger('change');
        });

        // Immediately run the 'onresize' functions.
        handleResize();

    }); // End of document.ready

})(jQuery);
document.addEventListener("DOMContentLoaded", scope);

function scope() {
    const Attributes = {
        FeatureId: "data-feature-id",
        FeatureRef: "data-feature-ref",
        TopLevel: "data-top-level",
        Inactive: "data-inactive"
    };

    const featureCardNodes = Array.from( document.querySelectorAll(`[${Attributes.FeatureId}]`) );
    const topLevelFeatureCards = featureCardNodes.filter(node => node.hasAttribute(Attributes.TopLevel));

    changeCardDetailColors(featureCardNodes);
    setupInitialCardState(featureCardNodes);

    setupControlButtons();
    setupSubfeatureButtons();

    function changeCardDetailColors(cardList) {
        for(var i = 0; i < cardList.length; i++ )
        {
            const card = cardList[i];
            setStatusColor(card);
            setAvailableColor(card);
        }

    }

    function setStatusColor(card) {
        const cardLabelElement = card.querySelector('.feature-card__status-value');

        addStatusColorClass(cardLabelElement);

    }

    function addStatusColorClass(cardLabelElement) {
        const cardLabelValue = cardLabelElement.innerHTML;

        if(cardLabelValue === 'Upcoming')
        {
            cardLabelElement.className += ' status-upcoming';
        }
        else if(cardLabelValue === 'In Progress')
        {
            cardLabelElement.className += ' status-in-progress';
        }
        else if(cardLabelValue === 'Complete')
        {
            cardLabelElement.className += ' status-complete';
        }

    }

    function setAvailableColor(card) {
        const cardLabelElement = card.querySelector('.feature-card__available-value');

        addAvailableColorClass(cardLabelElement);

    }

    function addAvailableColorClass(cardLabelElement) {
        const cardLabelValue = cardLabelElement.innerHTML;

        if(cardLabelValue === 'Within the next three years' || cardLabelValue === 'Next year')
        {
            cardLabelElement.className += ' available-next-or-three-years';
        }
        else if(cardLabelValue === 'This year')
        {
            cardLabelElement.className += ' available-this-year';
        }
        else if(cardLabelValue === 'Now')
        {
            cardLabelElement.className += ' available-now';
        }

    }

    function setupInitialCardState(cardList) {
        setAllButFirstCardAsInactive(cardList, true);
    }

    function setAllButFirstCardAsInactive(cardList) {
        cardList.slice(1).forEach(cardNode => setFeatureNodeAsInactive(cardNode));
    }

    function setFeatureNodeAsInactive(card) {
        card.setAttribute(Attributes.Inactive, '');
    }

    function setFeatureNodeAsActive(card) {
        card.removeAttribute(Attributes.Inactive);
    }

    function getFeatureCardNodeById(featureId) {
        return featureCardNodes.find(node => node.getAttribute(Attributes.FeatureId) === featureId);
    }

    function setFeatureIdAsInactive(featureId) {
        setFeatureNodeAsInactive( getFeatureCardNodeById(featureId) );
    }

    function setFeatureIdAsActive(featureId) {
        setFeatureNodeAsActive( getFeatureCardNodeById(featureId) );
    }

    function setupCoreButtonEventListeners(coreButtonList, cardList, cardValueList) {
        for( i = 0; i < coreButtonList.length; i++ ) {
            coreButtonList[i].addEventListener("click", function(){
                // Add click event here
            });
        }
    }

    function setupControlButtons() {
        document.querySelector('.js-next-button').addEventListener('click', function() {
            let index = findActiveIndex();
            index++;
            if (index >= topLevelFeatureCards.length)
                index = topLevelFeatureCards.length - 1;

            setIndexToActive(index);
        }, false);

        document.querySelector('.js-previous-button').addEventListener('click', function() {
            let index = findActiveIndex();
            index--;
            if (index <= 0)
                index = 0;

            setIndexToActive(index);
        }, false);
    }

    function findActiveIndex() {
        return topLevelFeatureCards.findIndex(cardNode => !cardNode.hasAttribute(Attributes.Inactive));
    }

    function setIndexToActive(newActiveIndex) {
        topLevelFeatureCards.forEach((node, index) => {
            if (newActiveIndex === index)
                setFeatureNodeAsActive(node);
            else
                setFeatureNodeAsInactive(node);
        });
    }

    function getCoreCardValueList(coreButtonList) {
        coreButtonList.map(coreButton => coreButton.outerText);
    }

    function setupSubfeatureButtons() {
        Array.from( document.querySelectorAll('.js-subfeature-button') ).forEach(button => {
            button.addEventListener('click', subfeatureButtonClicked, false);
        });
    }

    function subfeatureButtonClicked(event) {
        const featureId = this.getAttribute(Attributes.FeatureRef);
        const featureNode = getFeatureCardNodeById(featureId);
        Array.from( featureNode.parentNode.querySelectorAll(`[${Attributes.FeatureId}]`) )
            .forEach(node => setFeatureNodeAsInactive(node));
        setFeatureNodeAsActive(featureNode);
    }
}